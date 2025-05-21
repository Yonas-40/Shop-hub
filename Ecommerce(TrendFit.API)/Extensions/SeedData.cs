using Ecommerce_TrendFit.API_.Data;
using Ecommerce_TrendFit.API_.Models;

namespace Ecommerce_TrendFit.API_.Extensions;

public static class SeedData
{
    public static void SeedRoles(AppDbContext context)
    {
        if (!context.Roles.Any())
        {
            context.Roles.AddRange(
                new Role { Name = "Admin" },
                new Role { Name = "Customer" }
            );

            context.SaveChanges();
        }
    }
}
