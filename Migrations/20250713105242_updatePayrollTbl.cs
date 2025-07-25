using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagement.Migrations
{
    /// <inheritdoc />
    public partial class updatePayrollTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "PayrollRecords",
                newName: "EmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmployeeId",
                table: "PayrollRecords",
                newName: "UserId");
        }
    }
}
