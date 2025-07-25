using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagement.Migrations
{
    /// <inheritdoc />
    public partial class FixPayrollFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PayrollRecords_Employees_EmployeeId",
                table: "PayrollRecords");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Employees_EmployeeId",
                table: "Employees",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_PayrollRecords_Employees_EmployeeId",
                table: "PayrollRecords",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PayrollRecords_Employees_EmployeeId",
                table: "PayrollRecords");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Employees_EmployeeId",
                table: "Employees");

            migrationBuilder.AddForeignKey(
                name: "FK_PayrollRecords_Employees_EmployeeId",
                table: "PayrollRecords",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
