using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Services;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly FinanceService _finance;

        public FinanceController(AppDbContext context, FinanceService finance)
        {
            _context = context;
            _finance = finance;
        }
        // CRUD For Income
        [HttpGet("income")]
        public IActionResult GetAllIncome() => Ok(_context.CompanyIncomes.ToList());

        [HttpGet("income/{year}/{month}")]
        public IActionResult GetMonthlyIncome(int year, int month)
        {
            var income = _context.CompanyIncomes
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .ToList();

            if (!income.Any()) return NotFound(new {message = "No data found in the server."});

            return Ok(income);
        }

        [HttpGet("income/{id}")]
        public IActionResult GetIncome(int id)
        {
            //var income = _finance.GetNetIncome();
            var income = _context.CompanyIncomes.Find(id);

            return income != null ? Ok(income) : NotFound();
        }

        [HttpPost("create-income")]
        public IActionResult CreateIncome([FromBody] CompanyIncome income)
        {
            _context.CompanyIncomes.Add(income);
            _context.SaveChanges();
            return Ok(income);
        }

        [HttpPut("update-income/{id}")]
        public IActionResult UpdateIncome(int id, [FromBody] CompanyIncome updated)
        {
            var income = _context.CompanyIncomes.Find(id);
            if (income == null) return NotFound();

            income.Source = updated.Source;
            income.Amount = updated.Amount;
            income.Date = updated.Date;
            income.Description = updated.Description;

            _context.SaveChanges();
            return Ok(income);
        }

        [HttpDelete("delete-income/{id}")]
        public IActionResult DeleteIncome(int id) 
        {
            var income = _context.CompanyIncomes.Find(id);
            if (income == null) return NotFound();

            _context.CompanyIncomes.Remove(income);
            _context.SaveChanges();
            return Ok();
        }

        // CRUD for Expense
        [HttpGet("expense")]
        public IActionResult GetAllExpense() => Ok(_context.CompanyExpenses.ToList());

        [HttpGet("expense/{year}/{month}")]
        public IActionResult GetMonthlyExpense(int year, int month)
        {
            var expense = _context.CompanyExpenses
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .ToList();

            if (!expense.Any()) return NotFound(new { message = "No data found in the server." });

            return Ok(expense);
        }

        [HttpGet("expense/{id}")]
        public IActionResult GetExpense(int id)
        {
            //var income = _finance.GetNetIncome();
            var expense = _context.CompanyExpenses.Find(id);

            return expense != null ? Ok(expense) : NotFound();
        }

        [HttpPost("create-expense")]
        public IActionResult Create([FromBody] CompanyExpense expense)
        {
            _context.CompanyExpenses.Add(expense);
            _context.SaveChanges();
            return Ok(expense);
        }

        [HttpPut("update-expense/{id}")]
        public IActionResult Update(int id, [FromBody] CompanyExpense updated)
        {
            var expense = _context.CompanyExpenses.Find(id);
            if (expense == null) return NotFound();

            expense.Catagory = updated.Catagory;
            expense.Amount = updated.Amount;
            expense.Date = updated.Date;
            expense.Description = updated.Description;

            _context.SaveChanges();
            return Ok(expense);
        }

        [HttpDelete("delete-expense/{id}")]
        public IActionResult Delete(int id)
        {
            var expense = _context.CompanyExpenses.Find(id);
            if (expense == null) return NotFound();

            _context.CompanyExpenses.Remove(expense);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("summary-monthly/{year}/{month}")]
        public IActionResult GetMonthlySummary(int year, int month) 
        {
            var income = _finance.GetNetIncome(year, month);
            var expense = _finance.GetExpense(year, month);

            var netProfit = _finance.GetNetProfit(year, month);

            return Ok(new
            {
                Year = year,
                Month = month,
                TotalIncome = income,
                TotalExpense = expense,
                NetProfit = netProfit
            });
        }

        [HttpGet("report/pdf")]
        public IActionResult GenerateMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            var incomes = _finance.GetIncomesForMonth(year, month);
            
            var expenses = _finance.GetExpensesForMonth(year, month);
            var label = new DateTime(year, month, 1).ToString("MMMM yyyy");

            var document = new FinanceReportDocument
            {
                Incomes = incomes,
                Expenses = expenses,
                Label = label,
                Heading = "Monthly"
            };

            var stream = document.GeneratePdf();
            return File(stream, "application/pdf", $"Finance_Report_{label}.pdf");
        }

        [HttpGet("yearly-report")]
        public IActionResult GenerateYearlyReport([FromQuery] int year)
        {
            var incomes = _finance.GetYearlyIncomeList(year);
            var expenses = _finance.GetYearlyExpenseList(year);

            var label = year.ToString();

            var document = new FinanceReportDocument 
            {
                Incomes = incomes,
                Expenses = expenses,    
                Label = year.ToString(),
                Heading = "Yearly"
            }; 

            var stream = document.GeneratePdf();    
            return File(stream, "application/pdf", $"Finance_Report_{label}.pdf");
        }




    }
}
