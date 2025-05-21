using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce_TrendFit.API_.DTOs;

public class ShippingOptionDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }
    public int EstimatedDays { get; set; }
}
