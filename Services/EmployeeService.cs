using System.Linq;
using EmployeeManagement.Data;
using EmployeeManagement.Models;

namespace EmployeeManagement.Services
{
    public class EmployeeService
    {
        private readonly AppDbContext _context;
        private readonly Random _random = new Random();

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public int GenerateUniqueId()
        {
            int newId;

            do
            {
                newId = _random.Next(100000, 100000);
            }
            while (IsIdAlreadyInDatabase(newId));

            return newId;   
        }
        public bool IsIdAlreadyInDatabase(int employeeId) {
            return _context.Employees.Any(e => e.EmployeeId == employeeId); 
        }

        public decimal? GetAnnualNetPay(int employeeDBId, int year)
        {
            var summary = _context.AnnualSalarySummaries
                .FirstOrDefault(s => s.EmployeeId == employeeDBId && s.Year == year);

            return summary?.TotalNetPay;
        }

        public void UpdateAnnualSalarySummary(int businessEmployeeId, int year)
        {
            // Step 1: Resolve the actual database ID from the business-facing EmployeeId
            var employee = _context.Employees
                .FirstOrDefault(e => e.EmployeeId == businessEmployeeId);

            if (employee == null)
                throw new InvalidOperationException($"Employee with EmployeeId {businessEmployeeId} does not exist.");

            int employeeDbId = employee.Id;

            // Step 2: Calculate total net pay for the specified year
            decimal totalNetPay = _context.PayrollRecords
                .Where(p => p.EmployeeId == businessEmployeeId && p.PayDate.Year == year)
                .Sum(p => p.BaseSalary + p.Bonus - p.Deductions);

            // Step 3: Update or insert the annual summary
            var summary = _context.AnnualSalarySummaries
                .FirstOrDefault(s => s.EmployeeId == employeeDbId && s.Year == year);

            if (summary != null)
            {
                summary.TotalNetPay = totalNetPay;
                _context.AnnualSalarySummaries.Update(summary);
            }
            else
            {
                summary = new AnnualSalarySummary
                {
                    EmployeeId = employeeDbId,
                    Year = year,
                    TotalNetPay = totalNetPay
                };
                _context.AnnualSalarySummaries.Add(summary);
            }

            _context.SaveChanges();
        }
    }
}
