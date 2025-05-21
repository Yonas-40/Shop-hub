using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_TrendFit.API_.Controllers;
[Route("api/[controller]")]
[ApiController]
public class WishlistController : ControllerBase
{
    private readonly AppDbContext _context;

    public WishlistController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Wishlist/{userId}
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<WishlistItemDto>>> GetWishlist(Guid userId)
    {
        var wishlistItems = await _context.WishlistItems
            .Include(w => w.Product)
            .Where(w => w.UserId == userId)
            .Select(w => new WishlistItemDto
            {
                Id = w.Id,
                ProductId = w.ProductId,
                ProductName = w.Product.Name,
                ProductPrice = w.Product.Price,
                ProductImage = w.Product.ImageUrl,
                AddedAt = w.AddedAt
            })
            .ToListAsync();

        return wishlistItems;
    }

    // POST: api/Wishlist
    [HttpPost]
    public async Task<ActionResult<WishlistItem>> AddToWishlist(WishlistItemCreateDto wishlistItemDto)
    {
        // Check if product exists
        var productExists = await _context.Products.AnyAsync(p => p.Id == wishlistItemDto.ProductId);
        if (!productExists)
        {
            return NotFound("Product not found");
        }

        // Check if item already exists in wishlist
        var existingItem = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == wishlistItemDto.UserId && w.ProductId == wishlistItemDto.ProductId);

        if (existingItem != null)
        {
            return Conflict("Product already in wishlist");
        }

        var wishlistItem = new WishlistItem
        {
            UserId = wishlistItemDto.UserId,
            ProductId = wishlistItemDto.ProductId,
            AddedAt = DateTime.UtcNow
        };

        _context.WishlistItems.Add(wishlistItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWishlistItem), new { id = wishlistItem.Id }, wishlistItem);
    }

    // GET: api/Wishlist/item/{id}
    [HttpGet("item/{id}")]
    public async Task<ActionResult<WishlistItem>> GetWishlistItem(Guid id)
    {
        var wishlistItem = await _context.WishlistItems.FindAsync(id);

        if (wishlistItem == null)
        {
            return NotFound();
        }

        return wishlistItem;
    }

    // DELETE: api/Wishlist/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromWishlist(Guid id)
    {
        var wishlistItem = await _context.WishlistItems.FindAsync(id);
        if (wishlistItem == null)
        {
            return NotFound();
        }

        _context.WishlistItems.Remove(wishlistItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Wishlist/user/{userId}/product/{productId}
    [HttpDelete("user/{userId}/product/{productId}")]
    public async Task<IActionResult> RemoveProductFromWishlist(Guid userId, int productId)
    {
        var wishlistItem = await _context.WishlistItems
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

        if (wishlistItem == null)
        {
            return NotFound();
        }

        _context.WishlistItems.Remove(wishlistItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

