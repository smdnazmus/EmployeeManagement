using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EmployeeManagement.Models
{
    public class FinanceReportDocument : IDocument
    {
        public List<CompanyIncome> Incomes { get; set; }
        public List<CompanyExpense> Expenses { get; set; }
        public string Label { get; set; }

        public string Heading { get; set; }

        

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Header().Text($"{Heading} Financial Report – {Label}")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content().Column(col =>
                {
                    // Income Section
                    col.Item().Text("💰 Incomes").Bold().FontSize(16);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.ConstantColumn(120);
                            cols.RelativeColumn();
                            cols.ConstantColumn(80);
                            cols.ConstantColumn(120);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Date").Bold();
                            header.Cell().Text("Source").Bold();
                            header.Cell().Text("Amount").Bold();
                            header.Cell().Text("Description").Bold();
                        });

                        foreach (var income in Incomes)
                        {
                            table.Cell().Text(income.Date.ToString("dd MMM yyyy"));
                            table.Cell().Text(income.Source);
                            table.Cell().Text(Helper.Helper.FormatBDT(income.Amount));
                            table.Cell().Text(income.Description);
                        }
                    });
                    var totalIncome = Incomes.Sum(i => i.Amount);
                    col.Item().Text($"Total Income: {Helper.Helper.FormatBDT(totalIncome)}").Bold().FontColor(Colors.Green.Darken2);

                    col.Item().Text(" "); // Spacer

                    // Expense Section
                    col.Item().Text("📉 Expenses").Bold().FontSize(16);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(cols =>
                        {
                            cols.ConstantColumn(120);
                            cols.RelativeColumn();
                            cols.ConstantColumn(80);
                            cols.ConstantColumn(120);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Date").Bold();
                            header.Cell().Text("Category").Bold();
                            header.Cell().Text("Amount").Bold();
                            header.Cell().Text("Description").Bold();
                        });
                        foreach (var exp in Expenses)
                        {
                            table.Cell().Text(exp.Date.ToString("dd MMM yyyy"));
                            table.Cell().Text(exp.Catagory);
                            table.Cell().Text(Helper.Helper.FormatBDT(exp.Amount));
                            table.Cell().Text(exp.Description);
                        }
                    });

                    var totalExpense = Expenses.Sum(e => e.Amount);
                    col.Item().Text($"Total Expense: {Helper.Helper.FormatBDT(totalExpense)}").Bold().FontColor(Colors.Red.Darken2);
                });

                page.Footer().AlignCenter().Text($"© {DateTime.Now.Year} HR Dashboard by Asad Sazzad")
                    .FontSize(10).FontColor(Colors.Grey.Darken1);
            });
        }

        
    }
}
