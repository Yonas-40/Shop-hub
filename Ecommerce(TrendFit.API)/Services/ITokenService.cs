using Ecommerce_TrendFit.API_.Models;

namespace Ecommerce_TrendFit.API_.Services;

public interface ITokenService
{
    string CreateToken(User user, List<string> roles);
}
