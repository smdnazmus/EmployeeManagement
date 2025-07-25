using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Models
{
    public class EmployeeRegisterDto
    {
        // 🔑 Authentication Fields
        public string Username { get; set; }
        public string Password { get; set; }

        // 🧑 Personal Info
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }

        public string NID { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        // 🏠 Contact Info
        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Division { get; set; }
        public string Country { get; set; }

        // 🧭 Job Info
        public int EmployeeId { get; set; } // Unique employee code (not EF Id)
        public string Department { get; set; }
        public string Position { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }

        // 👤 Access Level
        public string Role { get; set; } // "Admin", "User", etc.
    }

}
