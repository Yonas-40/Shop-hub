using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.DTOs;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public int? Age { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public bool IsActive { get; set; }
    public bool EmailVerified { get; set; }

    public List<AddressDto> Addresses { get; set; } = new();
    public List<OrderDto> Orders { get; set; } = new();
    public List<CartItemDto> CartItems { get; set; } = new();
    public List<PaymentMethodDto> PaymentMethods { get; set; } = new();
    public List<WishlistItemDto> WishlistItems { get; set; } = new();
}