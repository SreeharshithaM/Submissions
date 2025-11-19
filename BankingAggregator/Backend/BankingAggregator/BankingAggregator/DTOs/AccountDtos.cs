using BankAggregator.Enums;

namespace BankAggregator.DTOs
{
    public record CreateAccountRequest(Guid OwnerId, AccountType Type, Currency Currency, string? BankId = null);
    public record AccountListDto(Guid Id, string AccountNumber, AccountType Type, AccountStatus Status, decimal Balance, Currency Currency, Guid OwnerId);
    public record DepositWithdrawRequest(Guid AccountId, decimal Amount, string? Description = null);
    public record TransferRequest(Guid FromAccountId, Guid ToAccountId, decimal Amount, string? Description = null);
    public record CloseAccountRequest(Guid AccountId);
}
