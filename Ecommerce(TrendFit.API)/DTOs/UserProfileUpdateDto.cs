namespace Ecommerce_TrendFit.API_.DTOs;

public class UserProfileUpdateDto
{
    public string FullName { get; set; }
    public string? Phone { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
}
