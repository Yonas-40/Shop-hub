using System.ComponentModel.DataAnnotations.Schema;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Models;

public class PaymentMethod
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string CardType { get; set; } = null!; // "Visa", "MasterCard", etc.
    public string LastFourDigits { get; set; } = null!;
    public DateTime ExpirationDate { get; set; }
    public string CardHolderName { get; set; } = null!;
    public bool IsDefault { get; set; } = false;
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    [InverseProperty("PaymentMethods")]
    public virtual User User { get; set; } = null!;

    [InverseProperty("PaymentMethod")]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}