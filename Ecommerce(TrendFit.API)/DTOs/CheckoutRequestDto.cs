using System.ComponentModel.DataAnnotations;

namespace Ecommerce_TrendFit.API_.DTOs;

public class CheckoutRequestDto
{
    [Required]
    public int ShippingOptionId { get; set; }

    [Required]
    public Guid ShippingAddressId { get; set; }

    [Required]
    public Guid PaymentMethodId { get; set; }
}
