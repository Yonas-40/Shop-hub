namespace Ecommerce_TrendFit.API_.Models;
public class Address
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Street { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Country { get; set; } = null!;
    public string? PostalCode { get; set; }
    public bool IsDefault { get; set; } = false;
    public string AddressType { get; set; } = "Home"; // "Home", "Work", "Other"
    public string? PhoneNumber { get; set; }
    public string? RecipientName { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}