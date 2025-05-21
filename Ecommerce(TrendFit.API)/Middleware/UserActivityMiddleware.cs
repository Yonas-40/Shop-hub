// UserActivityMiddleware.cs
using System.Security.Claims;
using Ecommerce_TrendFit.API_.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce_TrendFit.API_.Middleware;

public class UserActivityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserActivityMiddleware> _logger;

    public UserActivityMiddleware(
        RequestDelegate next,
        ILogger<UserActivityMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        // First process the request (let it go through the pipeline)
        await _next(context);

        // Then update activity (after we know authentication succeeded)
        if (context.Response.StatusCode < 400 && // Only if request was successful
            context.User.Identity?.IsAuthenticated == true)
        {
            var userIdStr = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (Guid.TryParse(userIdStr, out var userId))
            {
                try
                {
                    var user = await dbContext.Users.FindAsync(userId);
                    if (user != null)
                    {
                        // Only update IsActive here - LastLogin should be updated during actual login
                        user.IsActive = true;
                        await dbContext.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating user activity for user {UserId}", userId);
                }
            }
        }
    }
}