using BankAggregator.Data;
using BankAggregator.DTOs;
using BankAggregator.Models;
using BankAggregator.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace BankAggregator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SysAdmin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _pwdHasher;

        public UsersController(AppDbContext db, IPasswordHasher<User> pwdHasher)
        {
            _db = db;
            _pwdHasher = pwdHasher;
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
        {
            var q = _db.Users.AsQueryable();
            if (!string.IsNullOrEmpty(search)) q = q.Where(u => u.Email.Contains(search) || u.FullName.Contains(search));
            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize)
                .Select(u => new UserListDto(u.Id, u.Email, u.FullName, u.Role, u.EmailVerified, u.CreatedAt)).ToListAsync();
            return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = items });
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email)) return Conflict("Email already exists.");
            var user = new User { Email = dto.Email, FullName = dto.FullName, Role = dto.Role };
            user.PasswordHash = _pwdHasher.HashPassword(user, dto.Password);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = user.Id }, new UserListDto(user.Id, user.Email, user.FullName, user.Role, user.EmailVerified, user.CreatedAt));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var u = await _db.Users.FindAsync(id);
            if (u == null) return NotFound();
            return Ok(new UserListDto(u.Id, u.Email, u.FullName, u.Role, u.EmailVerified, u.CreatedAt));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
        {
            var u = await _db.Users.FindAsync(id);
            if (u == null) return NotFound();
            if (!string.IsNullOrEmpty(dto.FullName)) u.FullName = dto.FullName;
            if (dto.Role.HasValue) u.Role = dto.Role.Value;
            if (dto.EmailVerified.HasValue) u.EmailVerified = dto.EmailVerified.Value;
            await _db.SaveChangesAsync();
            return Ok(new UserListDto(u.Id, u.Email, u.FullName, u.Role, u.EmailVerified, u.CreatedAt));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var u = await _db.Users.FindAsync(id);
            if (u == null) return NotFound();
            _db.Users.Remove(u);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
