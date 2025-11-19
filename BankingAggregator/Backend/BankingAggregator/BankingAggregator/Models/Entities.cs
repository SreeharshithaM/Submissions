using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BankAggregator.Enums;

namespace BankAggregator.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(200)]
        public string Email { get; set; } = default!;

        [Required]
        public string PasswordHash { get; set; } = default!;

        [Required]
        public string FullName { get; set; } = default!;

        public UserRole Role { get; set; } = UserRole.Regular;

        public bool EmailVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Bank
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = default!;

        public string? SwiftCode { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    }

    public class Branch
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = default!;

        public string? Address { get; set; }

        public Guid BankId { get; set; }

        [ForeignKey(nameof(BankId))]
        public Bank? Bank { get; set; }
    }

    public class Account
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string AccountNumber { get; set; } = default!;

        public AccountType Type { get; set; } = AccountType.Checking;

        public AccountStatus Status { get; set; } = AccountStatus.Active;

        public Currency Currency { get; set; } = Currency.USD;

        public decimal Balance { get; set; } = 0m;

        public Guid OwnerId { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public User? Owner { get; set; }

        public Guid? BankId { get; set; }
        public Bank? Bank { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Transaction
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid AccountId { get; set; }

        [ForeignKey(nameof(AccountId))]
        public Account? Account { get; set; }

        public TransactionType Type { get; set; }

        public decimal Amount { get; set; }

        public Guid? RelatedAccountId { get; set; } // for transfers (counter-account)

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Token { get; set; } = default!;

        public Guid UserId { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool Revoked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
