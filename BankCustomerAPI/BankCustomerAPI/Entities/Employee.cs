namespace BankCustomerAPI.Entities
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Designation { get; set; }
        public DateTime HireDate { get; set; }
        public int BankId { get; set; }
        public Bank? Bank { get; set; }
    }
}
