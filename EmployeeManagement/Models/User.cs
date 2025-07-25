﻿using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Division { get; set; }
        public string Country { get; set; }
        public string Role { get; set; } = "User"; // Default to "User"

        [NotMapped]
        public string Password { get; set; }
    }
}
