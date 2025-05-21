using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrendFit.Api.Models;

namespace Ecommerce_TrendFit.API_.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuppliersController : ControllerBase
{
    private readonly AppDbContext _context;

    public SuppliersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
    {
        return await _context.Suppliers
            .Include(s => s.Products)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Supplier>> GetSupplierById(int id)
    {
        var supplier = await _context.Suppliers
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (supplier == null)
            return NotFound();

        return supplier;
    }

    //[Authorize(Roles = "Admin")]
    //[Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Supplier>> CreateSupplier(SupplierDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Supplier name cannot be empty.");
        }
        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest("Supplier email cannot be empty.");
        }
        if (string.IsNullOrWhiteSpace(dto.Phone))
        {
            return BadRequest("Supplier phone cannot be empty.");
        }

        if (await _context.Suppliers.AnyAsync(s => s.Name.ToLower() == dto.Name.ToLower()))
        {
            return Conflict("A supplier with this name already exists.");
        }
        if (await _context.Suppliers.AnyAsync(s => s.Email.ToLower() == dto.Email.ToLower()))
        {
            return Conflict("A supplier with this email already exists.");
        }
        if (await _context.Suppliers.AnyAsync(s => s.Phone == dto.Phone))
        {
            return Conflict("A supplier with this phone number already exists.");
        }

        var supplier = new Supplier
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone
        };
        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSupplierById), new { id = supplier.Id }, supplier);
    }

    //[Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, SupplierDto dto)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid supplier ID.");
        }
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Supplier name cannot be empty.");
        }
        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest("Supplier email cannot be empty.");
        }
        if (string.IsNullOrWhiteSpace(dto.Phone))
        {
            return BadRequest("Supplier phone cannot be empty.");
        }

        if (await _context.Suppliers.Where(s => s.Id != id).AnyAsync(s => s.Name.ToLower() == dto.Name.ToLower()))
        {
            return Conflict("A supplier with this name already exists.");
        }
        if (await _context.Suppliers.Where(s => s.Id != id).AnyAsync(s => s.Email.ToLower() == dto.Email.ToLower()))
        {
            return Conflict("A supplier with this email already exists.");
        }
        if (await _context.Suppliers.Where(s => s.Id != id).AnyAsync(s => s.Phone == dto.Phone))
        {
            return Conflict("A supplier with this phone number already exists.");
        }

        var supplier = await _context.Suppliers.FindAsync(id);

        if (supplier == null)
        {
            return NotFound();
        }

        supplier.Name = dto.Name;
        supplier.Email = dto.Email;
        supplier.Phone = dto.Phone;

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SupplierExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
    }

    //[Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Invalid supplier ID.");
        }

        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null)
        {
            return NotFound();
        }

        if (await _context.Products.AnyAsync(p => p.Supplier == supplier))
        {
            return BadRequest("Cannot delete supplier because it has associated products.");
        }

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SupplierExists(int id)
    {
        return _context.Suppliers.Any(e => e.Id == id);
    }
}

