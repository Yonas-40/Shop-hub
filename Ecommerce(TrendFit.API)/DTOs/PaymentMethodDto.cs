namespace Ecommerce_TrendFit.API_.DTOs;

// DTOs/PaymentMethodDto.cs
public class PaymentMethodDto
{
    public Guid Id { get; set; }
    public string CardType { get; set; }
    public string LastFourDigits { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string CardHolderName { get; set; } = null!;
    public bool IsDefault { get; set; }
    public DateTime AddedAt { get; set; }
}
