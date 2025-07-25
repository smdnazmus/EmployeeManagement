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
    public class ProfileController : ControllerBase
    {
        /*
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;

        public ProfileController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _jwt = new JwtService(config["JwtKey"]);
        }

        [HttpPost("change-password")]
        [Authorize] // Ensure only logged-in users can use this
        public IActionResult ChangePassword(ChangePasswordModel model)
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized("User Identity not found");

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            //var user = _context.Users.FirstOrDefault(u => u.Id == model.Id);
            if (user == null) return NotFound("User not found!");

            // Verify Current Password
            if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, user.PasswordHash))
            {
                return BadRequest("Incorrect current password!");
            }

            // Update with new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.Entry(user).State = EntityState.Modified; 
            _context.SaveChanges();
            return Ok(new { message = "Password Updated!" });
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

        
        [HttpPost("update-role")]
        public IActionResult UpdateRole(ChangeRoleModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == model.Id); ;

            
            if (user == null) return NotFound("User not found!");

            // Update with new role
            user.Role = model.NewRole;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(new { message = "Role Updated!" });

        }
        

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            var user = _context.Users.FirstOrDefault(x => x.Username == username);

            if (user == null) return NotFound();

            return Ok(new
            {
                fullName = user.FirstName + " " + user.LastName,
                email = user.Email,
                role = user.Role
            });
        }
        */
    }

}
