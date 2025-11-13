namespace BankCustomerAPI.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
    }
}
