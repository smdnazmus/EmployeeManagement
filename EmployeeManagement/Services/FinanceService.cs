using EmployeeManagement.Data;
using EmployeeManagement.Models;

namespace EmployeeManagement.Services
{
    public class FinanceService
    {
        private readonly AppDbContext _context;

        public FinanceService(AppDbContext context)
        {
            _context = context;
        }

        public decimal GetNetIncome(int year, int month)
        {
            var income = _context.CompanyIncomes
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .Sum(i => i.Amount);

            return income;
        }

        public decimal GetExpense(int year, int month)
        {
            var expenses = _context.CompanyExpenses
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .Sum(e => e.Amount);

            return expenses;
        }


        public decimal GetNetProfit(int year, int month)
        {
            var income = GetNetIncome(year, month);
            var expense = GetExpense(year, month);

            return income - expense;

        }

        public List<CompanyIncome> GetIncomesForMonth(int year, int month)
        {
            var income = _context.CompanyIncomes
                .Where(i => i.Date.Year == year && i.Date.Month == month)
                .ToList();

            return income;
        }

        public List<CompanyExpense> GetExpensesForMonth(int year, int month)
        {
            var expense = _context.CompanyExpenses
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .ToList();

            return expense;
        }

        public List<CompanyIncome> GetYearlyIncomeList(int year)
        {
            var incomes = _context.CompanyIncomes
                .Where(i => i.Date.Year == year)
                .ToList();

            return incomes;
        }

        public List<CompanyExpense> GetYearlyExpenseList(int year)
        {
            var expenses = _context.CompanyExpenses
                .Where(e => e.Date.Year == year)
                .ToList();

            return expenses;
        }
    }
}
