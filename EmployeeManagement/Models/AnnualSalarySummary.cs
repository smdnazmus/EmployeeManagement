using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    [Table("annualsalarysummaries")]
    public class AnnualSalarySummary
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("employeeid")]
        public int EmployeeId { get; set; }
        [Column("year")]
        public int Year { get; set; }
        [Column("totalnetpay")]
        public Decimal TotalNetPay { get; set; }

        [ForeignKey("employeeid")]
        public Employee Employee { get; set; }
    }
}
