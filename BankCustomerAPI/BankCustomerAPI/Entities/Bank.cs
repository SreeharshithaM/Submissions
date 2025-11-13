namespace BankCustomerAPI.Entities
{
    public class Bank
    {
        public int BankId { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
        public string? IFSCCode { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public ICollection<Account> Accounts { get; set; } = new List<Account>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
