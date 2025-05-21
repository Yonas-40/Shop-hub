using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ShippingOptionsController : ControllerBase
{
    private readonly AppDbContext _context; // Replace with your actual DbContext

    public ShippingOptionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/ShippingOptions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShippingOptionDto>>> GetShippingOptions()
    {
        return await _context.ShippingOptions
            .Select(so => new ShippingOptionDto
            {
                Id = so.Id,
                Name = so.Name,
                Price = so.Price,
                EstimatedDays = so.EstimatedDays
            })
            .ToListAsync();
    }

    // GET: api/ShippingOptions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ShippingOptionDto>> GetShippingOption(int id)
    {
        var shippingOption = await _context.ShippingOptions.FindAsync(id);

        if (shippingOption == null)
        {
            return NotFound();
        }

        var shippingOptionDto = new ShippingOptionDto
        {
            Id = shippingOption.Id,
            Name = shippingOption.Name,
            Price = shippingOption.Price,
            EstimatedDays = shippingOption.EstimatedDays
        };

        return shippingOptionDto;
    }

    // POST: api/ShippingOptions
    [HttpPost]
    public async Task<ActionResult<ShippingOptionDto>> PostShippingOption(CreateShippingOptionDto createShippingOptionDto)
    {
        var shippingOption = new ShippingOption
        {
            Name = createShippingOptionDto.Name,
            Price = createShippingOptionDto.Price,
            EstimatedDays = createShippingOptionDto.EstimatedDays
        };

        _context.ShippingOptions.Add(shippingOption);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShippingOption), new { id = shippingOption.Id }, new ShippingOptionDto
        {
            Id = shippingOption.Id,
            Name = shippingOption.Name,
            Price = shippingOption.Price,
            EstimatedDays = shippingOption.EstimatedDays
        });
    }

    // PUT: api/ShippingOptions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutShippingOption(int id, UpdateShippingOptionDto updateShippingOptionDto)
    {
        if (id != updateShippingOptionDto.Id)
        {
            return BadRequest();
        }

        var shippingOption = await _context.ShippingOptions.FindAsync(id);
        if (shippingOption == null)
        {
            return NotFound();
        }

        shippingOption.Name = updateShippingOptionDto.Name;
        shippingOption.Price = updateShippingOptionDto.Price;
        shippingOption.EstimatedDays = updateShippingOptionDto.EstimatedDays;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException) when (!ShippingOptionExists(id))
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/ShippingOptions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShippingOption(int id)
    {
        var shippingOption = await _context.ShippingOptions.FindAsync(id);
        if (shippingOption == null)
        {
            return NotFound();
        }

        _context.ShippingOptions.Remove(shippingOption);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ShippingOptionExists(int id)
    {
        return _context.ShippingOptions.Any(e => e.Id == id);
    }
}