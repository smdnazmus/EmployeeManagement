using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeLeaveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeLeaveController(AppDbContext context) 
        {
            _context = context;
        }


        [HttpGet]
        //public async Task<ActionResult<IEnumerable<EmployeeLeave>>> GetAllLeaves() =>
            //await _context.EmployeeLeaves.ToListAsync();
        public async Task<ActionResult<IEnumerable<object>>> GetAllLeaves()
        {
            var leavesWithNames = await (
                from leave in _context.EmployeeLeaves
                join emp in _context.Employees
                    on leave.EmployeeId equals emp.EmployeeId
                select new
                {
                    leave.Id,
                    leave.EmployeeId,
                    EmployeeName = emp.FirstName + " " + emp.LastName,
                    leave.LeaveType,
                    leave.StartDate,
                    leave.EndDate,
                    leave.Reason,
                    leave.Status
                })
                    .ToListAsync();

            return Ok(leavesWithNames);
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitLeave([FromBody] EmployeeLeave leave)
        {
            Console.WriteLine("api triggering");
            _context.EmployeeLeaves.Add(leave);
            await _context.SaveChangesAsync();  
            return Ok(new { message = "Leave request submitted." });
        }

        [HttpGet("employee/{id}")]
        public async Task<IActionResult> GetEmplyoeeLeaves(int id)
        {
            var leaves = await _context.EmployeeLeaves
                .Where(l => l.EmployeeId == id)
                .ToListAsync();

            return Ok(leaves);
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveLeave(int id)
        {
            var leave = await _context.EmployeeLeaves.FindAsync(id);
            leave.Status = "Approved";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Approved." });
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectLeave(int id)
        {
            var leave = await _context.EmployeeLeaves.FindAsync(id);
            leave.Status = "Rejected";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Rejected" });
        }
    }
}
