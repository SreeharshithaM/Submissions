namespace BankAggregator.DTOs
{
    public record TransactionDto(Guid Id, Guid AccountId, string Type, decimal Amount, Guid? RelatedAccountId, string? Description, DateTime CreatedAt);
    public record TransactionQueryParams(int Page = 1, int PageSize = 20, string? SortBy = null, bool Desc = false, DateTime? From = null, DateTime? To = null, string? Search = null);
}
