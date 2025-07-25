using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required]
        public int EmployeeId { get; set; }
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public DateTime BirthDate { get; set; }

        public string NID { get; set; }

        [Required]
        public string Username { get; set; }

        public string PasswordHash { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Division { get; set; }
        public string Country { get; set; }

        public string Role { get; set; } 

        // New fields for employee management
        public string Department { get; set; }
        public string Position { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }

        public string? PhotoUrl { get; set; } // can be a URL or base64 string

        public string? NIDUrl { get; set; } // can be a URL or base64 string


        [NotMapped]
        public string Password { get; set; }

        // Reverse navigation 
        public ICollection<PayrollRecord> PayrollRecords { get; set; }
    }
}
