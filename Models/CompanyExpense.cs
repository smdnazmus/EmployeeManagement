using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Models
{
    public class CompanyExpense
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        [Required]
        public string Catagory { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}
