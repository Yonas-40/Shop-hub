using TrendFit.Api.Models;
using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Ecommerce_TrendFit.API_.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null) return NotFound("User not found.");

        var shippingOption = await _context.ShippingOptions.FindAsync(dto.ShippingOptionId);
        if (shippingOption == null) return BadRequest("Invalid shipping option.");

        decimal orderTotal = dto.OrderItems.Sum(i => i.UnitPrice * i.Quantity);
        decimal totalPrice = orderTotal + shippingOption.Price;

        var order = new Order
        {
            UserId = dto.UserId,
            ShippingOptionId = dto.ShippingOptionId,
            CreatedAt = DateTime.UtcNow,
            PaymentMethodId = dto.PaymentMethodId,
            ShippingMethod = shippingOption.Name,
            ShippingCost = shippingOption.Price,
            TotalPrice = totalPrice,
            OrderNumber = $"ORD-{DateTime.UtcNow.Ticks}"
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var item in dto.OrderItems)
        {
            _context.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            });

            // reduce stock
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
            {
                product.Stock -= item.Quantity;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(order);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.ShippingOption)
            .Include(o => o.ShippingAddress)
            .Include(o => o.PaymentMethod)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        return Ok(order);
    }

    [HttpPost("checkout/{userId:guid}")]
    public async Task<ActionResult<Order>> Checkout(Guid userId, [FromBody] CheckoutRequestDto request)
    {
        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .ToListAsync();

        if (!cartItems.Any()) return BadRequest("Cart is empty.");

        var shippingOption = await _context.ShippingOptions.FindAsync(request.ShippingOptionId);
        if (shippingOption == null)
            return BadRequest("Invalid shipping option.");

        // Validate payment method belongs to user
        var paymentMethod = await _context.PaymentMethods
            .FirstOrDefaultAsync(pm => pm.Id == request.PaymentMethodId && pm.UserId == userId);
        if (paymentMethod == null)
            return BadRequest("Invalid payment method.");

        // Validate address
        var shippingAddress = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == request.ShippingAddressId && a.UserId == userId);
        if (shippingAddress == null)
            return BadRequest("Invalid shipping address.");

        // Validate stock
        foreach (var item in cartItems)
        {
            if (item.Product.Stock < item.Quantity)
                return BadRequest($"Product '{item.Product.Name}' is out of stock.");
        }

        // Calculate totals
        var subtotal = cartItems.Sum(i => i.Product.Price * i.Quantity);
        var taxAmount = subtotal * 0.1m; // 10% tax
        var shippingCost = shippingOption.Price;
        var totalPrice = subtotal + taxAmount + shippingCost;

        // Generate order number
        var orderNumber = $"ORD-{DateTime.UtcNow.Ticks}";

        // Create Order
        var order = new Order
        {
            UserId = userId,
            ShippingOptionId = request.ShippingOptionId,
            ShippingAddressId = request.ShippingAddressId,
            CreatedAt = DateTime.UtcNow,
            PaymentMethodId = request.PaymentMethodId,
            ShippingMethod = shippingOption.Name,
            Subtotal = subtotal,
            TaxAmount = taxAmount,
            TotalPrice = totalPrice,
            Status = "Pending",
            ShippingCost = shippingCost,
            OrderNumber = orderNumber
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Add OrderItems and reduce stock
        foreach (var item in cartItems)
        {
            _context.OrderItems.Add(new TrendFit.Api.Models.OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.Product.Price
            });

            item.Product.Stock -= item.Quantity;
        }

        // Clear cart
        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();
        return Ok(order);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(Guid userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .ToListAsync();
    }

    [HttpGet]
    //[Authorize(Roles = "Admin")] // Optionally restrict this endpoint to Admin users
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User) // Eagerly load the User entity
            .Include(o => o.PaymentMethod)
            .Include(o => o.ShippingOption)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Select(o => new OrderDto // Project to a DTO
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                PaymentMethodId = o.PaymentMethodId,
                ShippingCost = o.ShippingCost,
                ShippingMethod = o.ShippingMethod,
                ShippingOptionId = o.ShippingOptionId,
                UserId = o.UserId,
                UserName = o.User.FullName, // Include the user's name
                Status = o.Status, // Default status
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    ProductName = oi.Product.Name // Optionally include product name
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPatch("{id}")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        // Validate the new status (optional, but recommended)
        var allowedStatuses = new List<string> { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
        if (!allowedStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("Invalid order status.");
        }

        order.Status = dto.Status;
        await _context.SaveChangesAsync();

        return NoContent(); // Or return the updated order
    }
}
