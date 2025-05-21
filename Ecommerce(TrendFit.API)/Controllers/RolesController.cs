using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_TrendFit.API_.Controllers;
[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == dto.UserId);

        if (user == null)
            return NotFound("User not found.");

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == dto.RoleName);
        if (role == null)
            return NotFound("Role not found.");

        if (user.UserRoles.Any(ur => ur.RoleId == role.Id))
            return BadRequest("User already has this role.");

        user.UserRoles.Add(new UserRole { RoleId = role.Id, UserId = user.Id });
        await _context.SaveChangesAsync();

        return Ok("Role assigned.");
    }
}