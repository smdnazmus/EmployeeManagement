using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

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
