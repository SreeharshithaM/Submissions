using System.Security.Cryptography;
using System.Text;
using BankCustomerAPI.Data;
using BankCustomerAPI.Entities;
using BankCustomerAPI.Entities.DTO;
using BankCustomerAPI.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankCustomerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly JwtService _jwtService;

        public UsersController(DataContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest("Username already exists");

            using var sha = SHA256.Create();
            var hash = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(request.Password)));

            var user = new User
            {
                Username = request.Username,
                PasswordHash = hash,
                Email = request.Email,
                IsActive = true
            };

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
            if (role == null)
            {
                role = new Role { RoleName = request.RoleName, Description = $"{request.RoleName} role" };
                _context.Roles.Add(role);
                await _context.SaveChangesAsync();
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userRole = new UserRole
            {
                UserId = user.UserId,
                UserName = request.Username,
                RoleId = role.RoleId,
                RoleName = role.RoleName
            };

            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully", user.Username, role.RoleName });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            using var sha = SHA256.Create();
            var hash = Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(request.Password)));

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.PasswordHash == hash);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == user.UserId);

            var roleName = userRole?.RoleName ?? "No Role";

            var token = _jwtService.GenerateToken(user, roleName);

            var response = new LoginResponse
            {
                Username = user.Username ?? string.Empty,
                Email = user.Email ?? string.Empty,
                RoleName = roleName,
                Token = token
            };

            return Ok(response);
        }
    }
}