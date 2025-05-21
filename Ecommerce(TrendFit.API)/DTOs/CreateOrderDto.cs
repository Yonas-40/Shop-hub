using System.ComponentModel.DataAnnotations;

namespace Ecommerce_TrendFit.API_.DTOs;

public class CreateOrderDto
{
    public Guid UserId { get; set; }
    public int ShippingOptionId { get; set; }
    public Guid PaymentMethodId { get; set; }
    [MinLength(1, ErrorMessage = "At least one order item is required.")]
    public List<CreateOrderItemDto> OrderItems { get; set; }
}

public class CreateOrderItemDto
{
    [Required]
    public int ProductId { get; set; }
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0.")]
    public decimal UnitPrice { get; set; }
}