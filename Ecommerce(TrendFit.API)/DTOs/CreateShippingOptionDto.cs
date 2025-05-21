using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_TrendFit.API_.DTOs;

public class CreateShippingOptionDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    [Required]
    public int EstimatedDays { get; set; }
}