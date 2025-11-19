namespace BankAggregator.DTOs
{
    public record BankDto(Guid Id, string Name, string? SwiftCode);
    public record CreateBankDto(string Name, string? SwiftCode);
    public record BranchDto(Guid Id, string Name, string? Address, Guid BankId);
    public record CreateBranchDto(Guid BankId, string Name, string? Address);
}
