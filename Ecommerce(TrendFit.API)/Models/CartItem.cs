using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.EntityFrameworkCore;

namespace TrendFit.Api.Models;

[Index("ProductId", Name = "IX_CartItems_ProductId")]
[Index("UserId", Name = "IX_CartItems_UserId")]
public partial class CartItem
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public Guid UserId { get; set; }

    [ForeignKey("ProductId")]
    [InverseProperty("CartItems")]
    public virtual Product? Product { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("CartItems")]
    public virtual User? User { get; set; } = null!;
}
