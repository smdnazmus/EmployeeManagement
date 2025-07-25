namespace EmployeeManagement.Helper
{
    public static class Helper
    {
        public static string FormatBDT(decimal amount)
        {
            return $"৳ {amount:N2}";
        }

        
    }
}
