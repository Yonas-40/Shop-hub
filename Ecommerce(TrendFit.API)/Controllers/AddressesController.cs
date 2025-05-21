using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_TrendFit.API_.Controllers;
[Route("api/users/{userId}/[controller]")]
[ApiController]
public class AddressesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AddressesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users/{userId}/addresses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AddressDto>>> GetUserAddresses(Guid userId)
    {
        return await _context.Addresses
            .Where(a => a.UserId == userId)
            .Select(a => new AddressDto
            {
                Id = a.Id,
                Street = a.Street,
                City = a.City,
                Country = a.Country,
                PostalCode = a.PostalCode,
                IsDefault = a.IsDefault,
                AddressType = a.AddressType,
                RecipientName = a.RecipientName,
                PhoneNumber = a.PhoneNumber
            })
            .ToListAsync();
    }

    // GET: api/users/{userId}/addresses/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<AddressDto>> GetAddress(Guid userId, Guid id)
    {
        var address = await _context.Addresses
            .Where(a => a.Id == id && a.UserId == userId)
            .Select(a => new AddressDto
            {
                Id = a.Id,
                Street = a.Street,
                City = a.City,
                Country = a.Country,
                PostalCode = a.PostalCode,
                IsDefault = a.IsDefault,
                AddressType = a.AddressType,
                RecipientName = a.RecipientName,
                PhoneNumber = a.PhoneNumber
            })
            .FirstOrDefaultAsync();

        if (address == null)
        {
            return NotFound();
        }

        return address;
    }

    // POST: api/users/{userId}/addresses
    [HttpPost]
    public async Task<ActionResult<IEnumerable<AddressDto>>> AddAddress(Guid userId, CreateAddressDto createAddressDto)
    {
        var address = new Address
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Street = createAddressDto.Street,
            City = createAddressDto.City,
            Country = createAddressDto.Country,
            PostalCode = createAddressDto.PostalCode,
            AddressType = createAddressDto.AddressType,
            RecipientName = createAddressDto.RecipientName,
            PhoneNumber = createAddressDto.PhoneNumber,
            IsDefault = !await _context.Addresses.AnyAsync(a => a.UserId == userId)
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        var addressDto = new AddressDto
        {
            Id = address.Id,
            Street = address.Street,
            City = address.City,
            Country = address.Country,
            PostalCode = address.PostalCode,
            IsDefault = address.IsDefault,
            AddressType = address.AddressType,
            RecipientName = address.RecipientName,
            PhoneNumber = address.PhoneNumber
        };

        return CreatedAtAction(nameof(GetAddress), new { userId, id = address.Id }, addressDto);
    }


    // PUT: api/users/{userId}/addresses/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(Guid userId, Guid id, AddressDto addressDto)
    {
        if (id != addressDto.Id)
        {
            return BadRequest();
        }

        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address == null)
        {
            return NotFound();
        }

        address.Street = addressDto.Street;
        address.City = addressDto.City;
        address.Country = addressDto.Country;
        address.PostalCode = addressDto.PostalCode;
        address.AddressType = addressDto.AddressType;
        address.RecipientName = addressDto.RecipientName;
        address.PhoneNumber = addressDto.PhoneNumber;

        _context.Entry(address).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AddressExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/users/{userId}/addresses/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(Guid userId, Guid id)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address == null)
        {
            return NotFound();
        }

        // If deleting default address, set another as default if available
        if (address.IsDefault)
        {
            var newDefault = await _context.Addresses
                .Where(a => a.UserId == userId && a.Id != id)
                .FirstOrDefaultAsync();

            if (newDefault != null)
            {
                newDefault.IsDefault = true;
                _context.Entry(newDefault).State = EntityState.Modified;
            }
        }

        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/users/{userId}/addresses/{id}/set-default
    [HttpPatch("{id}/set-default")]
    public async Task<IActionResult> SetDefaultAddress(Guid userId, Guid id)
    {
        // First reset all addresses for this user to non-default
        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .ToListAsync();

        foreach (var addr in addresses)
        {
            addr.IsDefault = (addr.Id == id);
            _context.Entry(addr).State = EntityState.Modified;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool AddressExists(Guid id)
    {
        return _context.Addresses.Any(e => e.Id == id);
    }
}
