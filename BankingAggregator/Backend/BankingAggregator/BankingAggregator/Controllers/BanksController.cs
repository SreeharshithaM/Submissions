using BankAggregator.Data;
using BankAggregator.DTOs;
using BankAggregator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankAggregator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SysAdmin")]
    public class BanksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BanksController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
        {
            var q = _db.Banks.AsQueryable();
            if (!string.IsNullOrEmpty(search)) q = q.Where(b => b.Name.Contains(search));
            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).Select(b => new BankDto(b.Id, b.Name, b.SwiftCode)).ToListAsync();
            return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = items });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBankDto dto)
        {
            var b = new Bank { Name = dto.Name, SwiftCode = dto.SwiftCode };
            _db.Banks.Add(b);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = b.Id }, new BankDto(b.Id, b.Name, b.SwiftCode));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var b = await _db.Banks.Include(x => x.Branches).FirstOrDefaultAsync(x => x.Id == id);
            if (b == null) return NotFound();
            var dto = new
            {
                b.Id,
                b.Name,
                b.SwiftCode,
                Branches = b.Branches.Select(br => new BranchDto(br.Id, br.Name, br.Address, br.BankId))
            };
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateBankDto dto)
        {
            var b = await _db.Banks.FindAsync(id);
            if (b == null) return NotFound();
            b.Name = dto.Name;
            b.SwiftCode = dto.SwiftCode;
            await _db.SaveChangesAsync();
            return Ok(new BankDto(b.Id, b.Name, b.SwiftCode));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var b = await _db.Banks.Include(x => x.Branches).FirstOrDefaultAsync(x => x.Id == id);
            if (b == null) return NotFound();
            if (b.Branches.Any()) return BadRequest("Remove branches first.");
            _db.Banks.Remove(b);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
