namespace Ecommerce_TrendFit.API_.DTOs;

// DTOs/WishlistItemDto.cs
public class WishlistItemDto
{
    public Guid Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    public string ProductImage { get; set; }
    public DateTime AddedAt { get; set; }
}