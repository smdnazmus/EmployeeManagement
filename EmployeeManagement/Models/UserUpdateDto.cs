namespace EmployeeManagement.Models
{
    public class UserUpdateDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Division { get; set; }
        public string? Country { get; set; }

        // Optional fields for sensitive updates
        public string? Password { get; set; }
        public string? Role { get; set; }
    }
}
