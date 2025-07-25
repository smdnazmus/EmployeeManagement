using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagement.Data;
using EmployeeManagement.Models;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees() =>
            await _context.Employees.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            return emp == null ? NotFound() : emp;
        }

        [HttpGet("by-employeeid/{employeeId}")]
        public async Task<ActionResult<Employee>> GetEmployeeByEmpId(int employeeId)
        {
            var emp = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
            return emp == null ? NotFound() : emp;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, EmployeeUpdateDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound("Employee doesn't Exist!");

            // Only update fields that are present
            if (!string.IsNullOrWhiteSpace(dto.FirstName)) emp.FirstName = dto.FirstName;
            if (!string.IsNullOrWhiteSpace(dto.LastName)) emp.LastName = dto.LastName;
            if (!string.IsNullOrWhiteSpace(dto.NID)) emp.NID = dto.NID;
            if (!string.IsNullOrWhiteSpace(dto.Username)) emp.Username = dto.Username;
            if (!string.IsNullOrWhiteSpace(dto.Email)) emp.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber)) emp.PhoneNumber = dto.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(dto.Address)) emp.Address = dto.Address;
            if (!string.IsNullOrWhiteSpace(dto.City)) emp.City = dto.City;
            if (!string.IsNullOrWhiteSpace(dto.District)) emp.District = dto.District;
            if (!string.IsNullOrWhiteSpace(dto.Division)) emp.Division = dto.Division;
            if (!string.IsNullOrWhiteSpace(dto.Country)) emp.Country = dto.Country;
            if (!string.IsNullOrWhiteSpace(dto.Department)) emp.Department = dto.Department;
            if (!string.IsNullOrWhiteSpace(dto.Position)) emp.Position = dto.Position;
            if (dto.Salary != 0) emp.Salary = dto.Salary;

            // Handle password change if requested
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                emp.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            // Optional role update
            if (!string.IsNullOrWhiteSpace(dto.Role))
            {
                emp.Role = dto.Role;
            }

            _context.Entry(emp).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmoloyee(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("upload-photo/{id}")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile photo)
        {
            if (photo == null || photo.Length == 0) return BadRequest("Invalid image file.");

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var fileName = $"{Guid.NewGuid()}_{photo.FileName}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(stream);
            }

            var photoUrl = $"/uploads/{fileName}";

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound("Employee not found!");

            employee.PhotoUrl = photoUrl;
            await _context.SaveChangesAsync();

            return Ok(new { photoUrl }); 
        }

        [HttpPost("upload-csv")]
        public async Task<IActionResult> UploadEmployeeCSV(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("CSV file is required!");
            }

            var employees = new List<Employee>();

            try
            {
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        var values = line?.Split(',');

                        // CSV column order: 
                        // FirstName,LastName,BirthDate,Username,PasswordHash,Email,PhoneNumber,Address,City,District,Division,Country,Role,Department,Position,HireDate,Salary,PhotoUrl,EmployeeId

                        // Skip header
                        if (values[0] == "Id") continue;

                        employees.Add(new Employee
                        {
                            FirstName = values[1],
                            LastName = values[2],
                            BirthDate = DateTime.Parse(values[3]),
                            NID = values[4],
                            Username = values[5],
                            PasswordHash = values[6],
                            Email = values[7],
                            PhoneNumber = values[8],
                            Address = values[9],
                            City = values[10],
                            District = values[11],
                            Division = values[12],
                            Country = values[13],
                            Role = values[14],
                            Department = values[15],
                            Position = values[16],
                            HireDate = DateTime.Parse(values[17]),
                            Salary = decimal.Parse(values[18]),
                            PhotoUrl = values[19],
                            NIDUrl = values[20],
                            EmployeeId = int.Parse(values[21])
                        });
                    }
                }

                _context.Employees.AddRange(employees);
                await _context.SaveChangesAsync();

                return Ok(new { count = employees.Count });
            }

            catch (Exception ex)
            {

                return StatusCode(500, $"Server Error: {ex.Message}");

            }

        }

        [HttpPost("upload-nid/{id}")]
        public async Task<IActionResult> UploadNID (int id, IFormFile file)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)  return NotFound(new { message = "Employee Not Found!"});

            var folderName = $"{employee.FirstName}_{employee.LastName}_{employee.EmployeeId}";
            var uploadsRoot = Path.Combine("wwwroot", "uploads", folderName);

            if (!Directory.Exists(uploadsRoot))
            {
                Directory.CreateDirectory(uploadsRoot);
            }

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"NID{extension}";
            var fullPath = Path.Combine(uploadsRoot, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            employee.NIDUrl = Path.Combine("uploads", folderName, fileName);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Upload Successful", employee.NIDUrl});

        }

        

    }
}
