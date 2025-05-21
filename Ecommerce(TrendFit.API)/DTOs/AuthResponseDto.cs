namespace Ecommerce_TrendFit.API_.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; } = new(); // New property
}