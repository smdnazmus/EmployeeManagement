namespace EmployeeManagement.Models
{
    public class PayrollRecordDto
    {
        public int EmployeeId { get; set; }
        public DateTime PayDate { get; set; }
        public decimal BaseSalary { get; set; }
        public decimal Bonus { get; set; }
        public decimal Deductions { get; set; }
        public string Status { get; set; }
        public string User { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
