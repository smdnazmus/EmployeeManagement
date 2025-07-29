using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Services;


namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;
        private readonly EmployeeService _employee;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _jwt = new JwtService(config["JwtKey"]);
            _employee = new EmployeeService(context);
        }

        [HttpPost("register")]
        public IActionResult Register(EmployeeRegisterDto dto)
        {
            var employee = new Employee
            {
                EmployeeId = dto.EmployeeId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                BirthDate = dto.BirthDate,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                City = dto.City,
                District = dto.District,
                Division = dto.Division,
                Country = dto.Country,
                Role = dto.Role,
                Department = dto.Department,
                Position = dto.Position,
                HireDate = dto.HireDate,
                Salary = dto.Salary
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return Ok(employee);
        }

        [HttpGet("CheckEmployeeId/{id}")]
        public async Task<IActionResult> CheckEmployeeId(int id)
        {
            bool exists = await _context.Employees.AnyAsync(e => e.EmployeeId == id);
            return Ok(new { exists });
        }


        [HttpPost("create-employee")]
        public IActionResult CreateEmployee(CreateEmployeeDto dto)
        {
            var emp = new Employee
            {
                EmployeeId = dto.EmployeeId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                BirthDate = dto.BirthDate,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                City = dto.City,
                District = dto.District,
                Division = dto.Division,
                Country = dto.Country,
                Role = dto.Role ?? "Employee",
                Department = dto.Department,
                Position = dto.Position,
                HireDate = dto.HireDate,
                Salary = dto.Salary
            };

            _context.Employees.Add(emp);
            _context.SaveChanges();

            return Ok(emp);
        }

        [HttpOptions("login")]
        public IActionResult Preflight()
        {
            return Ok(); // Respond to CORS preflight
        }



        [HttpPost("login")]

        public IActionResult Login([FromBody] LoginRequest login)
        {
            var employee = _context.Employees.FirstOrDefault(u => u.Username == login.Username);
            
            if (employee == null || !BCrypt.Net.BCrypt.Verify(login.Password, employee.PasswordHash)) 
            {
                return Unauthorized();
            }
            
            var token = _jwt.GenerateToken(employee.Username);
            return Ok(new { 
                Token = token,
                Role = employee.Role,
                EmployeeId = employee.EmployeeId
            });
        }

        [HttpPost("reset-password-direct")]
        public IActionResult ForgotPasswordDirect(ResetPasswordModel request)
        {
            var employee = _context.Employees.FirstOrDefault(u => u.Username == request.Username);
            if (employee == null)
            {
                return NotFound("User not found!");
            }

            employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Password has been reset." });
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            var user = _context.Employees.FirstOrDefault(x => x.Username == username);

            if (user == null) return NotFound();

            return Ok(new
            {
                fullName = user.FirstName + " " + user.LastName,
                email = user.Email,
                role = user.Role
            });
        }

        [HttpPost("update-role")]
        public IActionResult UpdateRole(ChangeRoleModel model)
        {
            var employee = _context.Employees.FirstOrDefault(u => u.Id == model.Id); ;


            if (employee == null) return NotFound("Emplyoee not found!");

            // Update with new role
            employee.Role = model.NewRole;
            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(new { message = "Role Updated!" });

        }

        [HttpPost("change-emp-password")]
        [Authorize] // Ensure only logged-in users can use this
        public IActionResult ChangeEmpPassword(ChangePasswordModel model)
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized("User Identity not found");

            var emp = _context.Employees.FirstOrDefault(u => u.Username == username);
            //var user = _context.Users.FirstOrDefault(u => u.Id == model.Id);
            if (emp == null) return NotFound("User not found!");

            // Verify Current Password
            if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, emp.PasswordHash))
            {
                return BadRequest("Incorrect current password!");
            }

            // Update with new password
            emp.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.Entry(emp).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(new { message = "Password Updated!" });
        }
    }
}
