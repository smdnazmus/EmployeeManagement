namespace EmployeeManagement.Models
{
    public class PayrollRecord
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime PayDate { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPay => BaseSalary + Bonus - Deductions;
        public string Status { get; set; }

        public string User { get; set; }

        public DateTime UpdatedOn { get; set; }

        // Navigation property to Employee
        public Employee Employee { get; set; }
    }
}
