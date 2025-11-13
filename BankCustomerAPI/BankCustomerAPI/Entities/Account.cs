namespace BankCustomerAPI.Entities
{
    public class Account
    {
        public int AccountId { get; set; }
        public string? AccountNumber { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public string? AccountType { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User? User { get; set; }

        public int BankId { get; set; }
        public Bank? Bank { get; set; }
    }
}
