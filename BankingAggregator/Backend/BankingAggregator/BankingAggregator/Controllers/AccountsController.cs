using BankAggregator.Data;
using BankAggregator.DTOs;
using BankAggregator.Enums;
using BankAggregator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace BankAggregator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AccountsController(AppDbContext db) { _db = db; }

        // List accounts with pagination, sorting, typeahead (search)
        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? sortBy = "CreatedAt", [FromQuery] bool desc = false, [FromQuery] string? search = null)
        {
            var q = _db.Accounts.AsQueryable();

            // If regular user, only their accounts
            var role = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
            if (role == "Regular")
            {
                var userId = Guid.Parse(User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
                q = q.Where(a => a.OwnerId == userId);
            }

            if (!string.IsNullOrEmpty(search))
            {
                q = q.Where(a => a.AccountNumber.Contains(search) || a.Bank!.Name.Contains(search));
            }

            // sorting (basic)
            q = (sortBy?.ToLower()) switch
            {
                "balance" => desc ? q.OrderByDescending(a => a.Balance) : q.OrderBy(a => a.Balance),
                "type" => desc ? q.OrderByDescending(a => a.Type) : q.OrderBy(a => a.Type),
                _ => desc ? q.OrderByDescending(a => a.CreatedAt) : q.OrderBy(a => a.CreatedAt)
            };

            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
                        .Select(a => new AccountListDto(a.Id, a.AccountNumber, a.Type, a.Status, a.Balance, a.Currency, a.OwnerId))
                        .ToListAsync();

            return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = items });
        }

        [HttpPost]
        [Authorize(Roles = "SysAdmin,Regular")]
        public async Task<IActionResult> Create([FromBody] CreateAccountRequest req)
        {
            // For simplicity account number generated
            var acc = new Account
            {
                OwnerId = req.OwnerId,
                AccountNumber = $"ACCT-{DateTime.UtcNow.Ticks % 1000000000}",
                Type = req.Type,
                Currency = req.Currency,
                Balance = 0m,
                BankId = string.IsNullOrEmpty(req.BankId) ? null : Guid.TryParse(req.BankId, out var b) ? b : null
            };

            _db.Accounts.Add(acc);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = acc.Id }, acc);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var acc = await _db.Accounts.FindAsync(id);
            if (acc == null) return NotFound();
            return Ok(new AccountListDto(acc.Id, acc.AccountNumber, acc.Type, acc.Status, acc.Balance, acc.Currency, acc.OwnerId));
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositWithdrawRequest req)
        {
            if (req.Amount <= 0) return BadRequest("Amount must be positive.");
            var acc = await _db.Accounts.FindAsync(req.AccountId);
            if (acc == null) return NotFound("Account not found.");
            if (acc.Status == AccountStatus.Closed) return BadRequest("Account closed.");

            acc.Balance += req.Amount;
            var tx = new Transaction { AccountId = acc.Id, Type = TransactionType.Deposit, Amount = req.Amount, Description = req.Description };
            _db.Transactions.Add(tx);
            await _db.SaveChangesAsync();
            return Ok(new { acc.Balance });
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> Withdraw([FromBody] DepositWithdrawRequest req)
        {
            if (req.Amount <= 0) return BadRequest("Amount must be positive.");
            var acc = await _db.Accounts.FindAsync(req.AccountId);
            if (acc == null) return NotFound("Account not found.");
            if (acc.Status == AccountStatus.Closed) return BadRequest("Account closed.");
            if (acc.Balance < req.Amount) return BadRequest("Insufficient funds.");

            acc.Balance -= req.Amount;
            var tx = new Transaction { AccountId = acc.Id, Type = TransactionType.Withdraw, Amount = req.Amount, Description = req.Description };
            _db.Transactions.Add(tx);
            await _db.SaveChangesAsync();
            return Ok(new { acc.Balance });
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest req)
        {
            if (req.Amount <= 0) return BadRequest("Amount must be positive.");
            if (req.FromAccountId == req.ToAccountId) return BadRequest("Cannot transfer to same account.");

            var from = await _db.Accounts.FindAsync(req.FromAccountId);
            var to = await _db.Accounts.FindAsync(req.ToAccountId);
            if (from == null || to == null) return NotFound("One or both accounts not found.");
            if (from.Status == AccountStatus.Closed || to.Status == AccountStatus.Closed) return BadRequest("Account closed.");
            if (from.Balance < req.Amount) return BadRequest("Insufficient funds.");

            using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                from.Balance -= req.Amount;
                to.Balance += req.Amount;

                var t1 = new Transaction { AccountId = from.Id, Type = TransactionType.Transfer, Amount = req.Amount, RelatedAccountId = to.Id, Description = req.Description };
                var t2 = new Transaction { AccountId = to.Id, Type = TransactionType.Transfer, Amount = req.Amount, RelatedAccountId = from.Id, Description = req.Description };

                _db.Transactions.AddRange(t1, t2);
                await _db.SaveChangesAsync();
                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }

            return Ok(new { FromBalance = from.Balance, ToBalance = to.Balance });
        }

        [HttpPost("close")]
        public async Task<IActionResult> Close([FromBody] CloseAccountRequest req)
        {
            var acc = await _db.Accounts.FindAsync(req.AccountId);
            if (acc == null) return NotFound();
            if (acc.Balance != 0) return BadRequest("Account must have zero balance to close.");

            acc.Status = AccountStatus.Closed;
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
