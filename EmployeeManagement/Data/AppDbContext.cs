using Microsoft.EntityFrameworkCore;
using EmployeeManagement.Models;

namespace EmployeeManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<PayrollRecord> PayrollRecords { get; set; }

        public DbSet<AnnualSalarySummary> AnnualSalarySummaries { get; set; }

        public DbSet<CompanyExpense> CompanyExpenses { get; set; }

        public DbSet<CompanyIncome> CompanyIncomes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PayrollRecord>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.PayrollRecords)
                .HasPrincipalKey(e => e.EmployeeId)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeId)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2); // 18 total digits, 2 after the decimal point

            modelBuilder.Entity<PayrollRecord>()
                .Property(p => p.BaseSalary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PayrollRecord>()
                .Property(p => p.Bonus)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PayrollRecord>()
                .Property(p => p.Deductions)
                .HasPrecision(18, 2);

            modelBuilder.Entity<AnnualSalarySummary>()
                .Property(p => p.TotalNetPay)
                .HasPrecision(18, 2);

            modelBuilder.Entity<CompanyIncome>()
               .Property(p => p.Amount)
               .HasPrecision(18, 2);

            modelBuilder.Entity<CompanyExpense>()
               .Property(p => p.Amount)
               .HasPrecision(18, 2);

            base.OnModelCreating(modelBuilder);
        }

    }
}
