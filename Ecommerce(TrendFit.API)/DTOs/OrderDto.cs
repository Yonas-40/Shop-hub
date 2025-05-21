namespace Ecommerce_TrendFit.API_.DTOs;

// Create a new DTO class (OrderDto.cs)
public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalPrice { get; set; }
    public Guid? PaymentMethodId { get; set; }
    public decimal ShippingCost { get; set; }
    public string ShippingMethod { get; set; }
    public int? ShippingOptionId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } // New property for user's name
    public string Status { get; set; } // Default status
    public List<OrderItemDto> OrderItems { get; set; }
}
