namespace Ecommerce_TrendFit.API_.DTOs;

public class CreateAddressDto
{
    public string Street { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string? PostalCode { get; set; }
    public string AddressType { get; set; } = "Home";
    public string? RecipientName { get; set; }
    public string? PhoneNumber { get; set; }
}