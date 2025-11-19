namespace BankAggregator.Enums
{
    public enum UserRole
    {
        Regular = 0,
        SysAdmin = 1
    }

    public enum AccountType
    {
        Checking = 0,
        Savings = 1,
        Credit = 2
    }

    public enum AccountStatus
    {
        Active = 0,
        Closed = 1
    }

    public enum TransactionType
    {
        Deposit = 0,
        Withdraw = 1,
        Transfer = 2
    }

    public enum Currency
    {
        USD = 0,
        INR = 1,
        EUR = 2
    }
}
