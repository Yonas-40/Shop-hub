namespace Ecommerce_TrendFit.API_.DTOs;

public class WishlistItemCreateDto
{
    public Guid UserId { get; set; }
    public int ProductId { get; set; }
}