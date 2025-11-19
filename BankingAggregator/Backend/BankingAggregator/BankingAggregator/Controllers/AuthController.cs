using BankAggregator.Data;
using BankAggregator.DTOs;
using BankAggregator.Models;
using BankAggregator.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BankAggregator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;
        private readonly JwtOptions _jwtOptions;
        private readonly IPasswordHasher<User> _pwdHasher;

        public AuthController(AppDbContext db, ITokenService tokenService, IOptions<JwtOptions> jwtOptions, IPasswordHasher<User> pwdHasher)
        {
            _db = db;
            _tokenService = tokenService;
            _jwtOptions = jwtOptions.Value;
            _pwdHasher = pwdHasher;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (existing != null) return Conflict("Email already in use.");

            var user = new User
            {
                Email = req.Email,
                FullName = req.FullName,
                Role = Enums.UserRole.Regular
            };
            user.PasswordHash = _pwdHasher.HashPassword(user, req.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // TODO: Send verification email with token
            return Ok(new { user.Id, user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return Unauthorized("Invalid credentials.");

            var verify = _pwdHasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
            if (verify == PasswordVerificationResult.Failed) return Unauthorized("Invalid credentials.");

            var access = _tokenService.GenerateAccessToken(user);
            var (refresh, refreshExpires) = _tokenService.GenerateRefreshToken();

            var rt = new RefreshToken
            {
                Token = refresh,
                UserId = user.Id,
                ExpiresAt = refreshExpires
            };

            _db.RefreshTokens.Add(rt);
            await _db.SaveChangesAsync();

            return Ok(new AuthResponse(access, refresh, DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes)));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
        {
            var rt = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == req.RefreshToken);
            if (rt == null || rt.Revoked || rt.ExpiresAt < DateTime.UtcNow)
                return Unauthorized("Invalid refresh token.");

            var user = await _db.Users.FindAsync(rt.UserId);
            if (user == null) return Unauthorized();

            // revoke old token and issue a new one
            rt.Revoked = true;

            var (newRefresh, newRefreshExp) = _tokenService.GenerateRefreshToken();
            var newRt = new RefreshToken
            {
                Token = newRefresh,
                UserId = user.Id,
                ExpiresAt = newRefreshExp
            };

            _db.RefreshTokens.Add(newRt);

            var newAccess = _tokenService.GenerateAccessToken(user);
            await _db.SaveChangesAsync();

            return Ok(new AuthResponse(newAccess, newRefresh, DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes)));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
        {
            var rt = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == req.RefreshToken);
            if (rt == null) return NotFound();
            rt.Revoked = true;
            await _db.SaveChangesAsync();
            return Ok();
        }

        // Basic verify (example: verify email)
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest req)
        {
            var user = await _db.Users.FindAsync(req.UserId);
            if (user == null) return NotFound();
            // For demo: just set verified. In real app validate token
            user.EmailVerified = true;
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
