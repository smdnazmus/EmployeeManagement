using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    public class AnnualSalarySummary
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int Year { get; set; }
        public Decimal TotalNetPay { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee Employee { get; set; }
    }
}
