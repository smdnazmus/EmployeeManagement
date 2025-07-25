namespace EmployeeManagement.Models
{
    public class EmployeeUpdateDto
    {
        public int? EmployeeId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NID { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Division { get; set; }
        public string? Country { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public decimal Salary { get; set; }

        // Optional fields for sensitive updates
        public string? Password { get; set; }
        public string? Role { get; set; }

        public string? PhotoUrl { get; set; } // for updating photo
        public string? NIDUrl { get; set; } // for updating NID

    }
}
