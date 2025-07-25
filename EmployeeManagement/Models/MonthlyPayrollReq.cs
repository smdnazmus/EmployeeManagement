namespace EmployeeManagement.Models
{
    public class MonthlyPayrollReq
    {
        public string Status { get; set; }
        public string User { get; set; }
        public DateTime UpdatedOn { get; set; }
        public DateTime Date { get; set; }
        //public PayrollRecord Record { get; set; }
    }
}
