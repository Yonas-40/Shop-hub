namespace Ecommerce_TrendFit.API_.DTOs;

// Optionally create an OrderItemDto.cs if you want a cleaner structure for order items
public class OrderItemDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? ProductName { get; set; } // Optional: Include product name
}