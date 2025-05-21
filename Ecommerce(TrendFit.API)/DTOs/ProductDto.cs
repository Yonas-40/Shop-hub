namespace Ecommerce_TrendFit.API_.DTOs;

public class ProductDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }

    public bool IsFeatured { get; set; }
    public int CategoryId { get; set; }
    public int SupplierId { get; set; }
    public string? ImageUrl { get; set; }

    // New properties in DTO
    public double? Rating { get; set; }
    public int? Reviews { get; set; }
    public decimal? Discount { get; set; }
}
