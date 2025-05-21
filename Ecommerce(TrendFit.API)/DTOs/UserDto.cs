namespace Ecommerce_TrendFit.API_.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string? Phone { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public List<AddressDto> Addresses { get; set; } = new();
    public List<PaymentMethodDto> PaymentMethods { get; set; } = new();
    public List<WishlistItemDto> WishlistItems { get; set; } = new();
}