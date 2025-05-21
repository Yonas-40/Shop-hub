using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_TrendFit.API_.Controllers;

[Route("api/users/{userId}/[controller]")]
[ApiController]
public class PaymentMethodsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentMethodsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users/{userId}/paymentmethods
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetUserPaymentMethods(Guid userId)
    {
        return await _context.PaymentMethods
            .Where(p => p.UserId == userId)
            .Select(p => new PaymentMethodDto
            {
                Id = p.Id,
                CardType = p.CardType,
                LastFourDigits = p.LastFourDigits,
                ExpirationDate = p.ExpirationDate,
                CardHolderName = p.CardHolderName,
                IsDefault = p.IsDefault,
                AddedAt = p.AddedAt
            })
            .ToListAsync();
    }

    // GET: api/users/{userId}/paymentmethods/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentMethodDto>> GetPaymentMethod(Guid userId, Guid id)
    {
        var paymentMethod = await _context.PaymentMethods
            .Where(p => p.Id == id && p.UserId == userId)
            .Select(p => new PaymentMethodDto
            {
                Id = p.Id,
                CardType = p.CardType,
                LastFourDigits = p.LastFourDigits,
                ExpirationDate = p.ExpirationDate,
                CardHolderName = p.CardHolderName,
                IsDefault = p.IsDefault,
                AddedAt = p.AddedAt
            })
            .FirstOrDefaultAsync();

        if (paymentMethod == null)
        {
            return NotFound();
        }

        return paymentMethod;
    }

    // POST: api/users/{userId}/paymentmethods
    [HttpPost]
    public async Task<ActionResult<PaymentMethodDto>> AddPaymentMethod(
        Guid userId,
        [FromBody] CreatePaymentMethodDto createPaymentMethodDto)
    {
        // Extract last 4 digits
        var lastFourDigits = createPaymentMethodDto.CardNumber.Length > 4
            ? createPaymentMethodDto.CardNumber.Substring(createPaymentMethodDto.CardNumber.Length - 4)
            : createPaymentMethodDto.CardNumber;

        var paymentMethod = new PaymentMethod
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CardType = createPaymentMethodDto.CardType,
            LastFourDigits = lastFourDigits,
            ExpirationDate = createPaymentMethodDto.ExpirationDate,
            CardHolderName = createPaymentMethodDto.CardHolderName,
            IsDefault = !await _context.PaymentMethods.AnyAsync(p => p.UserId == userId),
            AddedAt = DateTime.UtcNow
        };

        _context.PaymentMethods.Add(paymentMethod);
        await _context.SaveChangesAsync();

        var paymentMethodDto = new PaymentMethodDto
        {
            Id = paymentMethod.Id,
            CardType = paymentMethod.CardType,
            LastFourDigits = paymentMethod.LastFourDigits,
            ExpirationDate = paymentMethod.ExpirationDate,
            CardHolderName = paymentMethod.CardHolderName,
            IsDefault = paymentMethod.IsDefault,
            AddedAt = paymentMethod.AddedAt
        };

        return CreatedAtAction(
            nameof(GetPaymentMethod),
            new { userId, id = paymentMethod.Id },
            paymentMethodDto);
    }

    // DELETE: api/users/{userId}/paymentmethods/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePaymentMethod(Guid userId, Guid id)
    {
        var paymentMethod = await _context.PaymentMethods
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (paymentMethod == null)
        {
            return NotFound();
        }

        var wasDefault = paymentMethod.IsDefault;

        _context.PaymentMethods.Remove(paymentMethod);

        if (wasDefault)
        {
            var newDefault = await _context.PaymentMethods
                .Where(p => p.UserId == userId && p.Id != id)
                .FirstOrDefaultAsync();

            if (newDefault != null)
            {
                newDefault.IsDefault = true;
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/users/{userId}/paymentmethods/{id}/set-default
    [HttpPatch("{id}/set-default")]
    public async Task<IActionResult> SetDefaultPaymentMethod(Guid userId, Guid id)
    {
        var paymentMethod = await _context.PaymentMethods
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (paymentMethod == null)
        {
            return NotFound();
        }

        var currentDefault = await _context.PaymentMethods
            .Where(p => p.UserId == userId && p.IsDefault)
            .FirstOrDefaultAsync();

        if (currentDefault != null && currentDefault.Id != id)
        {
            currentDefault.IsDefault = false;
        }

        paymentMethod.IsDefault = true;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}