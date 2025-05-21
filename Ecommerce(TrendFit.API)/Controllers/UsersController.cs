using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_TrendFit.API_.Controllers;
//[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(AppDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Helper method to check if user exists
    private bool UserExists(Guid id)
    {
        return _context.Users.Any(e => e.Id == id);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetUsersWithOrders()
    {
        try
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.Orders)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(u => u.Addresses)
                .Include(u => u.PaymentMethods)
                .Include(u => u.WishlistItems)
                    .ThenInclude(wi => wi.Product)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Age,
                    u.Phone,
                    u.CreatedAt,
                    CartItems = u.CartItems.Select(ci => new
                    {
                        ci.Product,
                        ci.Quantity
                    }),
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    Orders = u.Orders.Select(o => new
                    {
                        o.Id,
                        o.CreatedAt,
                        o.TotalPrice,
                        o.Status,
                        OrderItems = o.OrderItems.Select(oi => new
                        {
                            oi.ProductId,
                            oi.Quantity,
                            oi.UnitPrice,
                            oi.Product.Name
                        }).ToList()
                    }).ToList(),
                    Addresses = u.Addresses.Select(a => new
                    {
                        a.Id,
                        a.Street,
                        a.City,
                        a.Country
                    }).ToList(),
                    PaymentMethods = u.PaymentMethods.Select(p => new
                    {
                        p.Id,
                        p.CardType,
                        p.LastFourDigits
                    }).ToList(),
                    WishlistCount = u.WishlistItems.Count
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users with orders");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetUserById(Guid id)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.Orders)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(u => u.Addresses)
                .Include(u => u.PaymentMethods)
                .Include(u => u.WishlistItems)
                    .ThenInclude(wi => wi.Product)
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    u.Age,
                    u.CreatedAt,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    Orders = u.Orders.Select(o => new
                    {
                        o.Id,
                        o.CreatedAt,
                        o.TotalPrice,
                        o.Status,
                        OrderItems = o.OrderItems.Select(oi => new
                        {
                            oi.ProductId,
                            oi.Quantity,
                            oi.UnitPrice,
                            oi.Product.Name
                        }).ToList()
                    }).ToList(),
                    Addresses = u.Addresses.Select(a => new
                    {
                        a.Id,
                        a.Street,
                        a.City,
                        a.Country,
                        a.IsDefault,
                        a.AddressType
                    }),
                    PaymentMethods = u.PaymentMethods.Select(p => new
                    {
                        p.Id,
                        p.CardType,
                        p.LastFourDigits,
                        p.IsDefault
                    }),
                    WishlistItems = u.WishlistItems.Select(w => new
                    {
                        w.Id,
                        w.ProductId,
                        w.Product.Name,
                        w.Product.Price,
                        w.Product.ImageUrl,
                        w.AddedAt
                    })
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting user by ID: {id}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .Include(u => u.Addresses)
                .Include(u => u.PaymentMethods)
                .Include(u => u.WishlistItems)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound("User not found.");

            // Remove related entities
            _context.UserRoles.RemoveRange(user.UserRoles);
            _context.Addresses.RemoveRange(user.Addresses);
            _context.PaymentMethods.RemoveRange(user.PaymentMethods);
            _context.WishlistItems.RemoveRange(user.WishlistItems);

            // Then remove the user
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting user: {id}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{userId}/assign-role")]
    public async Task<IActionResult> AssignRole(Guid userId, [FromBody] string roleName)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found.");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
            if (role == null)
                return BadRequest("Role does not exist.");

            if (user.UserRoles.Any(ur => ur.RoleId == role.Id))
                return BadRequest("User already has this role.");

            user.UserRoles.Add(new UserRole { UserId = userId, RoleId = role.Id });
            await _context.SaveChangesAsync();

            return Ok("Role assigned.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error assigning role {roleName} to user {userId}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{userId}/remove-role")]
    public async Task<IActionResult> RemoveRole(Guid userId, [FromBody] string roleName)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found.");

            var userRole = user.UserRoles.FirstOrDefault(ur => ur.Role.Name == roleName);
            if (userRole == null)
                return BadRequest("User does not have this role.");

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return Ok("Role removed.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error removing role {roleName} from user {userId}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("create-role")]
    public async Task<IActionResult> CreateRole([FromBody] string roleName)
    {
        try
        {
            if (await _context.Roles.AnyAsync(r => r.Name == roleName))
                return BadRequest("Role already exists.");

            _context.Roles.Add(new Role { Name = roleName });
            await _context.SaveChangesAsync();

            return Ok("Role created.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error creating role: {roleName}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/profile")]
    public async Task<ActionResult<UserProfileDto>> GetUserProfile(Guid id)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.PaymentMethods)
                .Include(u => u.WishlistItems)
                    .ThenInclude(wi => wi.Product)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(u => u.CartItems)
                    .ThenInclude(ci => ci.Product)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Age = user.Age,
                Gender = user.Gender,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
                IsActive = user.IsActive,
                EmailVerified = user.EmailVerified,
                Addresses = user.Addresses.Select(a => new AddressDto
                {
                    Id = a.Id,
                    Street = a.Street,
                    City = a.City,
                    Country = a.Country,
                    PostalCode = a.PostalCode,
                    IsDefault = a.IsDefault,
                    AddressType = a.AddressType,
                    RecipientName = a.RecipientName,
                    PhoneNumber = a.PhoneNumber
                }).ToList(),
                PaymentMethods = user.PaymentMethods.Select(p => new PaymentMethodDto
                {
                    Id = p.Id,
                    CardType = p.CardType,
                    LastFourDigits = p.LastFourDigits,
                    ExpirationDate = p.ExpirationDate,
                    IsDefault = p.IsDefault
                }).ToList(),
                WishlistItems = user.WishlistItems.Select(w => new WishlistItemDto
                {
                    Id = w.Id,
                    ProductId = w.Product.Id,
                    ProductName = w.Product.Name,
                    ProductPrice = w.Product.Price,
                    ProductImage = w.Product.ImageUrl,
                    AddedAt = w.AddedAt
                }).ToList(),
                Orders = user.Orders.Select(o => new OrderDto
                {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                }).ToList()
            }).OrderByDescending(o => o.CreatedAt).ToList(),
                CartItems = user.CartItems.Select(c => new CartItemDto
            {
                Id = c.Id,
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                Quantity = c.Quantity,
                Price = c.Product.Price,
                ImageUrl = c.Product.ImageUrl
            }).ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting profile for user: {id}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateUserProfile(Guid id, UserProfileUpdateDto profileDto)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FullName = profileDto.FullName ?? user.FullName;
            user.Phone = profileDto.Phone ?? user.Phone;
            user.Age = profileDto.Age ?? user.Age;
            user.Gender = profileDto.Gender ?? user.Gender;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating profile for user: {id}");
            return StatusCode(500, "Internal server error");
        }
    }
}