using Ecommerce_TrendFit.API_.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartItemsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<IEnumerable<CartItem>>> GetCartItems(Guid userId)
    {
        return await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CartItem>> AddToCart(CartItem item)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == item.UserId && ci.ProductId == item.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += item.Quantity;
        }
        else
        {
            _context.CartItems.Add(item);
        }

        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
    {
        var item = await _context.CartItems.FindAsync(id);
        if (item == null) return NotFound();

        item.Quantity = quantity;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveItem(int id)
    {
        var item = await _context.CartItems.FindAsync(id);
        if (item == null) return NotFound();

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("clear/{userId:guid}")]
    public async Task<IActionResult> ClearCart(Guid userId)
    {
        var items = _context.CartItems.Where(ci => ci.UserId == userId);
        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
