using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    public class CompanyIncome
    {
        
        public int Id { get; set; }
        
        public DateTime Date { get; set; }

        [Required]
        public string Source { get; set; } // e.g., Sales, Investment, Services
        
        public decimal Amount { get; set; }
       
        public string Description { get; set; }
    }
}
