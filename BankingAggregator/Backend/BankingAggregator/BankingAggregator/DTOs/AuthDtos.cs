using BankAggregator.Enums;

namespace BankAggregator.DTOs
{
    public record RegisterRequest(string Email, string Password, string FullName);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(string AccessToken, string RefreshToken, DateTime ExpiresAt);
    public record RefreshRequest(string RefreshToken);
    public record VerifyEmailRequest(Guid UserId, string Token);
    public record LogoutRequest(string RefreshToken);
}
