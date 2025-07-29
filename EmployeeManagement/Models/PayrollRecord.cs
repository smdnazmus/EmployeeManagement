using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    [Table("payrollrecords")]
    public class PayrollRecord
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("employeeid")]
        public int EmployeeId { get; set; }
        [Column("paydate")]
        public DateTime PayDate { get; set; }
        [Column("basesalary")]
        public decimal BaseSalary { get; set; }
        [Column("bonus")]
        public decimal Bonus { get; set; }
        [Column("deductions")]
        public decimal Deductions { get; set; }
        public decimal NetPay => BaseSalary + Bonus - Deductions;

        [Column("status")]
        public string Status { get; set; }
       
        public string User { get; set; }
        [Column("updatedon")]
        public DateTime UpdatedOn { get; set; }

        // Navigation property to Employee
        public Employee Employee { get; set; }
    }
}
