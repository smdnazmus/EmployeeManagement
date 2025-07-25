namespace EmployeeManagement.Models
{
    public class AnnualSalarySummaryDto
    {
        public int EmployeeId { get; set; }
        public int Year { get; set; }
        public Decimal TotalNetPay { get; set; }
    }
}
