namespace Ecommerce_TrendFit.API_.DTOs;

public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    
    public string ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
    public string Category { get; set; }
    public string Supplier { get; set; }
    public double? Rating { get; set; }
    public int? Reviews { get; set; }
    public decimal? Discount { get; set; }
}
