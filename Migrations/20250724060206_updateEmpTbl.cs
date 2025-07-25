using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagement.Migrations
{
    /// <inheritdoc />
    public partial class updateEmpTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NID",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NIDUrl",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NID",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "NIDUrl",
                table: "Employees");
        }
    }
}
