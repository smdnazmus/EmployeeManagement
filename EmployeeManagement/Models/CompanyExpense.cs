using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace EmployeeManagement.Models
{
    [Table("companyexpenses")]
    public class CompanyExpense
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("date")]
        public DateTime Date { get; set; }

        [Required]
        [Column("catagory")]
        public string Catagory { get; set; }
        [Column("amount")]
        public decimal Amount { get; set; }
        [Column("description")]
        public string Description { get; set; }
    }
}
