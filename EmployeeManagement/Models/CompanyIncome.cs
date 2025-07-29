using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    [Table("companyincomes")]
    public class CompanyIncome
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("date")]
        public DateTime Date { get; set; }

        [Required]
        [Column("source")]
        public string Source { get; set; } // e.g., Sales, Investment, Services
        [Column("amount")]
        public decimal Amount { get; set; }
        [Column("description")]
        public string Description { get; set; }
    }
}
