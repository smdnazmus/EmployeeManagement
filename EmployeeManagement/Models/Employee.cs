using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    [Table("employees")]
    public class Employee
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("employeeid")]
        [Required]
        public int EmployeeId { get; set; }
        [Column("firstname")]
        [Required]
        public string FirstName { get; set; }
        [Column("lastname")]
        [Required]
        public string LastName { get; set; }
        [Column("birthdate")]
        public DateTime BirthDate { get; set; }
        [Column("nid")]
        public string NID { get; set; }
        [Column("username")]
        [Required]
        public string Username { get; set; }
        [Column("passwordhash")]
        public string PasswordHash { get; set; }

        [Column("email")]
        [Required, EmailAddress]
        public string Email { get; set; }
        [Column("phonenumber")]
        public string PhoneNumber { get; set; }
        [Column("address")]
        public string Address { get; set; }
        [Column("city")]
        public string City { get; set; }
        [Column("district")]
        public string District { get; set; }
        [Column("division")]
        public string Division { get; set; }
        [Column("country")]
        public string Country { get; set; }
        [Column("role")]
        public string Role { get; set; }

        // New fields for employee management
        [Column("department")]
        public string Department { get; set; }
        [Column("position")]
        public string Position { get; set; }
        [Column("hiredate")]
        public DateTime HireDate { get; set; }
        [Column("salary")]
        public decimal Salary { get; set; }
        [Column("photourl")]
        public string? PhotoUrl { get; set; } // can be a URL or base64 string
        [Column("nidurl")]
        public string? NIDUrl { get; set; } // can be a URL or base64 string


        [NotMapped]
        public string Password { get; set; }

        // Reverse navigation 
        public ICollection<PayrollRecord> PayrollRecords { get; set; }
    }
}
