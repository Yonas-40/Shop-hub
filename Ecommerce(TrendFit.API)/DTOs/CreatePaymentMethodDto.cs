namespace Ecommerce_TrendFit.API_.DTOs;

public class CreatePaymentMethodDto
{
    public string CardType { get; set; } = null!;
    public string CardNumber { get; set; } = null!; // Full number for processing
    public DateTime ExpirationDate { get; set; }
    public string CardHolderName { get; set; } = null!;
    public string? SecurityCode { get; set; } // For validation but not stored
}