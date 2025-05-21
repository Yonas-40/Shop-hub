using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TrendFit.Api.Models;

public partial class ShippingOption
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }
    public int EstimatedDays { get; set; }  // Estimated days for delivery
    [InverseProperty("ShippingOption")]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
