using System.Security.Cryptography;
using Ecommerce_TrendFit.API_.DTOs;
using Ecommerce_TrendFit.API_.Models;
using Ecommerce_TrendFit.API_.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Ecommerce_TrendFit.API_.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Ecommerce_TrendFit.API_.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly ILogger<UsersController> _logger;
    public AuthController(AppDbContext context, ITokenService tokenService, ILogger<UsersController> logger)
    {
        _context = context;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email is already taken.");

        // Find the role (or create it if needed)
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
        if (role == null)
        {
            role = new Role { Name = "Customer" };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
        }

        var user = new User
        {
            Id = Guid.NewGuid(), // Generate a new Guid here
            FullName = dto.Username,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow, // Set initial last login
            IsActive = true, // Set as active on registration
            // Assign role to user
            UserRoles = new List<UserRole>
            {
                new UserRole { Role = role }
            }
        };

        _context.Add(user);
        await _context.SaveChangesAsync();


        var roles = user.UserRoles?.Select(ur => ur.Role.Name).ToList();
        var token = _tokenService.CreateToken(user, roles);


        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = user.FullName,
            Email = user.Email,
            Roles = roles
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _context.Users.Include(user => user.UserRoles).ThenInclude(userRole => userRole.Role).FirstOrDefaultAsync(
            u => u.Email == dto.Email || u.FullName == dto.Email);

        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");
        // Update last login and set as active
        user.LastLogin = DateTime.UtcNow;
        user.IsActive = true;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log the error but don't fail the login
            _logger.LogError(ex, "Error updating last login for user {UserId}", user.Id);
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var token = _tokenService.CreateToken(user, roles);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = user.FullName,
            Email = user.Email,
            Roles = roles
        });
    }
    // New endpoint to get the current user's information based on the token
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == userEmail);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

        return Ok(new AuthResponseDto
        {
            Token = Request.Headers["Authorization"].ToString().Replace("Bearer ", ""), // Optionally return the current token
            Username = user.FullName,
            Email = user.Email,
            Roles = roles
        });
    }
    // New endpoint to validate the token (optional, but can be useful)
    [HttpGet("validate")]
    [Authorize]
    public ActionResult ValidateToken()
    {
        // If the user can access this endpoint with a valid token, the token is valid.
        return Ok(new { message = "Token is valid." });
    }
    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private bool VerifyPassword(string password, string storedHash)
    {
        return HashPassword(password) == storedHash;
    }
}
