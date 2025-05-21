using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .ToListAsync();

        return Ok(products);
    }
    [HttpGet("filtered")]
    public async Task<ActionResult<FilteredProductResponse>> GetFilteredProducts(
       [FromQuery] decimal? minPrice,
       [FromQuery] decimal? maxPrice,
       [FromQuery] int? minRating,
       [FromQuery] string? categories,
       [FromQuery] string? brands,
       [FromQuery] string? search,
       [FromQuery] string? sort,
       [FromQuery] int page = 1,
       [FromQuery] int pageSize = 9)
    {
        try
        {
            IQueryable<Product> query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Supplier);
            // Get price range from all products (not filtered)
            var priceRange = await _context.Products
                .Select(p => p.Price)
                .ToListAsync();
            var minProductPrice = priceRange.Any() ? priceRange.Min() : 0;
            var maxProductPrice = priceRange.Any() ? priceRange.Max() : 1000; // Default if no products
            // Price filter
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Category filter
            if (!string.IsNullOrEmpty(categories))
            {
                var categoryIds = categories.Split(',').Select(int.Parse).ToList();
                query = query.Where(p => categoryIds.Contains(p.CategoryId));
            }

            // Search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Description.Contains(search));
            }

            // Sorting
            if (!string.IsNullOrEmpty(sort))
            {
                query = sort.ToLower() switch
                {
                    "price-low" => query.OrderBy(p => p.Price),
                    "price-high" => query.OrderByDescending(p => p.Price),
                    "newest" => query.OrderByDescending(p => p.Id),
                    "rating" => query.OrderByDescending(p => p.Rating),
                    _ => query.OrderByDescending(p => p.Id) // Default sorting
                };
            }

            var totalCount = await query.CountAsync();
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Rating = p.Rating,
                    Reviews = p.Reviews,
                    ImageUrl = p.ImageUrl,
                    IsFeatured = p.IsFeatured,
                    Category = p.Category.Name,
                    Supplier = p.Supplier.Name,
                    Discount = p.Discount
                })
                .ToListAsync();

            return Ok(new FilteredProductResponse
            {
                Products = products,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                MinPrice = minProductPrice,
                MaxPrice = maxProductPrice
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Product>>> GetFeaturedProducts()
    {
        var featured = await _context.Products
            .Where(p => p.IsFeatured)
            .ToListAsync();

        return Ok(featured);
    }
    [HttpGet("new-arrivals")]
    public async Task<ActionResult<IEnumerable<object>>> GetNewArrivals(int count = 8) // Changed return type to IEnumerable<object>
    {
        var newArrivals = await _context.Products
            .Where(p => !p.IsFeatured)
            .OrderByDescending(p => p.Id)
            .Take(count)
            .Include(p => p.Category) // Eager load the Category navigation property
            .Select(p => new // Project the results into a new anonymous object
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.Stock,
                p.ImageUrl,
                p.IsFeatured,
                CategoryName = p.Category.Name // Include the category name
                // Add other product properties you want to send
            })
            .ToListAsync();

        return Ok(newArrivals);
    }
    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategory(int categoryId)
    {
        var products = await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound();
        return Ok(product);
    }

    //[Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(ProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Discount = dto.Discount, // Add Discount
            Stock = dto.Stock,
            IsFeatured = dto.IsFeatured,
            Rating = dto.Rating,   // Add Rating
            Reviews = dto.Reviews, // Add Reviews
            CategoryId = dto.CategoryId,
            SupplierId = dto.SupplierId,
            ImageUrl = dto.ImageUrl
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    //[Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Discount = dto.Discount ?? product.Discount; // Add Discount
        product.Stock = dto.Stock;
        product.Rating = dto.Rating ?? product.Rating;   // Add Rating
        product.Reviews = dto.Reviews ?? product.Reviews; // Add Reviews
        product.IsFeatured = dto.IsFeatured;
        product.CategoryId = dto.CategoryId;
        product.SupplierId = dto.SupplierId;
        product.ImageUrl = dto.ImageUrl ?? product.ImageUrl;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    //[Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Add to ProductsController.cs
    [HttpGet("{id}/wishlist-status")]
    public async Task<ActionResult<bool>> GetWishlistStatus(int id, [FromQuery] Guid userId)
    {
        var isInWishlist = await _context.WishlistItems
            .AnyAsync(w => w.ProductId == id && w.UserId == userId);

        return isInWishlist;
    }
}

