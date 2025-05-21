using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.EntityFrameworkCore;

namespace TrendFit.Api.Models;

[Index("ShippingOptionId", Name = "IX_Orders_ShippingOptionId")]
[Index("PaymentMethodId", Name = "IX_Orders_PaymentMethodId")]  // Add this index
public partial class Order
{
    [Key]
    public int Id { get; set; }

    /*public int CustomerId { get; set; }
    */

    public int ShippingOptionId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TotalPrice { get; set; }

    public Guid? PaymentMethodId { get; set; }

    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal ShippingCost { get; set; }

    public string ShippingMethod { get; set; } = null!;
    
    // New OrderNumber column for unique order number
    public string OrderNumber { get; set; } = null!;
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; }
    
    [InverseProperty("Order")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [ForeignKey("ShippingOptionId")]
    [InverseProperty("Orders")]
    public virtual ShippingOption? ShippingOption { get; set; } = null!;

    // New Status property
    public string Status { get; set; } = "Pending"; // Default status

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TaxAmount { get; set; }  // Add tax amount (10% of subtotal)

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Subtotal { get; set; }  // Add subtotal before tax/shipping

    // Replace shipping address fields with address relation
    public Guid? ShippingAddressId { get; set; }

    [ForeignKey("ShippingAddressId")]
    public virtual Address? ShippingAddress { get; set; }

    // Add navigation property for PaymentMethod
    [ForeignKey("PaymentMethodId")]
    [InverseProperty("Orders")]
    public virtual PaymentMethod? PaymentMethod { get; set; }
}
