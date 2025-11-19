using BankAggregator.Enums;

namespace BankAggregator.DTOs
{
    public record UserListDto(Guid Id, string Email, string FullName, UserRole Role, bool EmailVerified, DateTime CreatedAt);
    public record CreateUserDto(string Email, string Password, string FullName, UserRole Role = UserRole.Regular);
    public record UpdateUserDto(Guid Id, string? FullName = null, UserRole? Role = null, bool? EmailVerified = null);
}
