using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Services;

QuestPDF.Settings.License = LicenseType.Community;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtkey = builder.Configuration["JwtKey"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p =>
    {
        p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("a-string-secret-at-least-256-bits-long")),
            ValidateIssuer = false,
            ValidateAudience = false,
            NameClaimType = ClaimTypes.Name // this is the key fix
        };

    });

builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<FinanceService>();


builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(PayrollProfile));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();


app.Run();
