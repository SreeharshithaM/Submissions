using BankAggregator.Models;

namespace BankAggregator.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        (string token, DateTime expiresAt) GenerateRefreshToken();
    }
}
