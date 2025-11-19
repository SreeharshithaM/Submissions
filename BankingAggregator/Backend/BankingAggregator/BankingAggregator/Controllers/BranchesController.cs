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
    public class BranchesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BranchesController(AppDbContext db) { _db = db; }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBranchDto dto)
        {
            var bank = await _db.Banks.FindAsync(dto.BankId);
            if (bank == null) return BadRequest("Bank not found.");
            var br = new Branch { BankId = dto.BankId, Name = dto.Name, Address = dto.Address };
            _db.Branches.Add(br);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = br.Id }, new BranchDto(br.Id, br.Name, br.Address, br.BankId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var br = await _db.Branches.FindAsync(id);
            if (br == null) return NotFound();
            return Ok(new BranchDto(br.Id, br.Name, br.Address, br.BankId));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CreateBranchDto dto)
        {
            var br = await _db.Branches.FindAsync(id);
            if (br == null) return NotFound();
            br.Name = dto.Name;
            br.Address = dto.Address;
            await _db.SaveChangesAsync();
            return Ok(new BranchDto(br.Id, br.Name, br.Address, br.BankId));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var br = await _db.Branches.FindAsync(id);
            if (br == null) return NotFound();
            _db.Branches.Remove(br);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
