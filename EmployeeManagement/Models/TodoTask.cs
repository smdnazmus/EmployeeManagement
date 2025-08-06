namespace EmployeeManagement.Models
{
    public class TodoTask
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public string CreatedBy { get; set; }
        public bool IsDone { get; set; }
    }
}
