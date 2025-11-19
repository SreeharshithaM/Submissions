using BankAggregator.Data;
using BankAggregator.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankAggregator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TransactionsController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] TransactionQueryParams query)
        {
            var q = _db.Transactions.Include(t => t.Account).AsQueryable();

            // restrict regular users to their accounts
            var role = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
            if (role == "Regular")
            {
                var userId = Guid.Parse(User.Claims.First(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub).Value);
                q = q.Where(t => t.Account != null && t.Account.OwnerId == userId);
            }

            if (query.From.HasValue) q = q.Where(t => t.CreatedAt >= query.From.Value);
            if (query.To.HasValue) q = q.Where(t => t.CreatedAt <= query.To.Value);

            if (!string.IsNullOrEmpty(query.Search))
            {
                q = q.Where(t => t.Description != null && t.Description.Contains(query.Search));
            }

            q = (query.SortBy?.ToLower()) switch
            {
                "amount" => query.Desc ? q.OrderByDescending(t => t.Amount) : q.OrderBy(t => t.Amount),
                _ => query.Desc ? q.OrderByDescending(t => t.CreatedAt) : q.OrderBy(t => t.CreatedAt)
            };

            var total = await q.CountAsync();
            var items = await q.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
                .Select(t => new TransactionDto(t.Id, t.AccountId, t.Type.ToString(), t.Amount, t.RelatedAccountId, t.Description, t.CreatedAt))
                .ToListAsync();

            return Ok(new { Total = total, Page = query.Page, PageSize = query.PageSize, Items = items });
        }
    }
}
