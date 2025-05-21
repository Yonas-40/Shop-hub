using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.EntityFrameworkCore;

namespace TrendFit.Api.Models;

[Index("CategoryId", Name = "IX_Products_CategoryId")]
[Index("SupplierId", Name = "IX_Products_SupplierId")]
public partial class Product
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool IsFeatured { get; set; }

    public int CategoryId { get; set; }

    public int SupplierId { get; set; }

    public string? ImageUrl { get; set; }

    // New properties
    public double? Rating { get; set; } = 0;

    public int? Reviews { get; set; } = 0;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Discount { get; set; } = 0;

    [InverseProperty("Product")]
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    [ForeignKey("CategoryId")]
    [InverseProperty("Products")]
    public virtual Category Category { get; set; } = null!;

    [InverseProperty("Product")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [ForeignKey("SupplierId")]
    [InverseProperty("Products")]
    public virtual Supplier Supplier { get; set; } = null!;

    // In Product.cs
    [InverseProperty("Product")]
    public virtual ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}
