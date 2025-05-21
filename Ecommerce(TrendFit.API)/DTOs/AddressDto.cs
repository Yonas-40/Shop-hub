namespace Ecommerce_TrendFit.API_.DTOs;

public class AddressDto
{
    public Guid Id { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string? PostalCode { get; set; }
    public bool IsDefault { get; set; }
    public string AddressType { get; set; }
    public string? RecipientName { get; set; }
    public string? PhoneNumber { get; set; }
}