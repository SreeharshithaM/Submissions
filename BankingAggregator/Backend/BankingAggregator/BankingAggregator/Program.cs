using BankAggregator.Data;
using BankAggregator.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Text;
using BankAggregator.Models;

var builder = WebApplication.CreateBuilder(args);

// ---------------------- CORS (MUST BE BEFORE BUILD) ----------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ---------------------- CONFIG ----------------------
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<ITokenService, TokenService>();

// ---------------------- JWT ----------------------
var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtOptions>();
var key = Encoding.UTF8.GetBytes(jwtConfig.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig.Issuer,
        ValidAudience = jwtConfig.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

// ---------------------- AUTHORIZATION ----------------------
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SysAdmin", policy => policy.RequireClaim("role", "SysAdmin"));
    options.AddPolicy("Regular", policy => policy.RequireClaim("role", "Regular"));
});

// ---------------------- MVC & SWAGGER ----------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ******************************************************
// BUILD ONLY ONCE
// ******************************************************
var app = builder.Build();

// ---------------------- USE CORS ----------------------
app.UseCors("AllowReact");

// ---------------------- MIGRATION + SEED ----------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any())
    {
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
        var admin = new User
        {
            Email = "admin@bank.com",
            FullName = "Sys Admin",
            Role = BankAggregator.Enums.UserRole.SysAdmin,
            EmailVerified = true
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Admin@123");
        db.Users.Add(admin);
        db.SaveChanges();
    }
}

// ---------------------- SWAGGER ----------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
