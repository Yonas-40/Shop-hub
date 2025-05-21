using System.Net;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    // Customer fields
    
    public string? Phone { get; set; }
    public int? Age { get; set; }

    // New field
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Additional suggested fields
    public DateTime? LastLogin { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Gender { get; set; }
    public bool EmailVerified { get; set; } = false;
    // Navigation properties
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    public ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}

