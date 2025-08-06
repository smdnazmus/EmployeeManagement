using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Services;
using DotNetEnv;
using Microsoft.Extensions.FileProviders;

QuestPDF.Settings.License = LicenseType.Community;

// Load .env file at startup
Env.Load();

var builder = WebApplication.CreateBuilder(args);
var env = builder.Environment;

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = Environment.GetEnvironmentVariable("DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

//Console.WriteLine($"connection string {connectionString}");


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var jwtKey = Environment.GetEnvironmentVariable("JwtKey")
    ?? builder.Configuration["JwtKey"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p =>
    {
        var frontendOrigin = env.IsDevelopment()
            ? "http://localhost:4200"
            : "https://employeemanagementui.netlify.app";

        p.WithOrigins(frontendOrigin)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
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

app.UseCors("AllowFrontend");

app.Use(async (context, next) =>
{
    var origin = context.Request.Headers["Origin"];
    Console.WriteLine($"Origin received: {origin}");
    await next();
});

app.UseStaticFiles();

app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();


app.Run();
