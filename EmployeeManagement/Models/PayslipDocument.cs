using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace EmployeeManagement.Models
{
    public class PayslipDocument : IDocument
    {
        private readonly PayrollRecord _payroll;
        private readonly Employee _employee;
        //private readonly AnnualSalarySummary _salarySummary;
        private readonly decimal? totalNetPay;

        public PayslipDocument(PayrollRecord payroll, Employee employee, Decimal? totalNetPay)
        {
            _payroll = payroll;
            _employee = employee;
            this.totalNetPay = totalNetPay;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                // 1. Header with Logo and Company Name
                page.Header()
                .AlignCenter()
                .Row(row =>
                {
                    row.ConstantItem(60).Height(60).Image("wwwroot/images/logoAngular.png"); // Left-aligned logo
                    row.RelativeItem().AlignMiddle().Text("TestApp").FontSize(24).Bold().FontColor(Colors.Blue.Medium);
                });

                page.Content().Column(col =>
                {
                    col.Spacing(15);

                    // 2 & 3. Employee Info Blocks
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().PaddingRight(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(left =>
                        {
                            left.Item().AlignCenter().Text($"Full Name: {_employee.FirstName} {_employee.LastName}").Bold();
                            left.Item().AlignCenter().Text($"Address: {_employee.Address}, {_employee.City}, {_employee.District}, {_employee.Division}, {_employee.Country}");
                        });

                        row.RelativeItem().PaddingLeft(10).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10).Column(right =>
                        {
                            right.Item().AlignCenter().Text($"Birthdate: {_employee.BirthDate:dd MMM yyyy}");
                            right.Item().AlignCenter().Text($"Pay Date: {_payroll.PayDate:dd MMM yyyy}");
                            right.Item().AlignCenter().Text($"Department: {_employee.Department}");
                            right.Item().AlignCenter().Text($"Position: {_employee.Position}");
                        });
                    });

                    // 4. Payslip Title
                    col.Item().Text($"Payslip for {_payroll.PayDate:MMMM yyyy}")
                        .FontSize(16).Bold().FontColor(Colors.Black).AlignCenter();

                    // 5. Salary Info Table
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Element(CellStyle).Text("Description").Bold();
                            header.Cell().Element(CellStyle).Text("Amount").Bold();
                        });

                        table.Cell().Element(CellStyle).Text("Base Salary");
                        table.Cell().Element(CellStyle).Text(Helper.Helper.FormatBDT(_payroll.BaseSalary));

                        table.Cell().Element(CellStyle).Text("Bonus");
                        table.Cell().Element(CellStyle).Text(Helper.Helper.FormatBDT(_payroll.Bonus));

                        table.Cell().Element(CellStyle).Text("Deductions");
                        table.Cell().Element(CellStyle).Text(Helper.Helper.FormatBDT(_payroll.Deductions));

                        table.Cell().Element(CellStyle).Text("Net Pay").Bold();
                        table.Cell().Element(CellStyle).Text(Helper.Helper.FormatBDT(_payroll.NetPay)).Bold().FontColor(Colors.Green.Medium);

                        table.Cell().Element(CellStyle).Text("Annual Summary").Bold();
                        table.Cell().Element(CellStyle).Text(Helper.Helper.FormatBDT(this.totalNetPay.GetValueOrDefault())).Bold().FontColor(Colors.Green.Medium);
                    });
                });

                // Footer
                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span($"Created By: {_payroll.User}   ");
                    text.Span($"Created On: {_payroll.UpdatedOn:yyyy-MM-dd}   ");
                    text.Span($"Status: {_payroll.Status}");
                });
            });

        // Helper for consistent table styling
        static IContainer CellStyle(IContainer container) =>
            container.PaddingVertical(5).PaddingHorizontal(10).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);


    }
    }
}
