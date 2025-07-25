using System.IO.Compression;
using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using EmployeeManagement.Data;
using EmployeeManagement.Models;
using EmployeeManagement.Services;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayrollController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly EmployeeService _empService;

        public PayrollController(AppDbContext context, IMapper mapper, EmployeeService empService)
        {
            _context = context;
            _mapper = mapper;
            _empService = empService;
        }

        // GET: All payroll records
        [HttpGet]
        public IActionResult GetAll()
        {
            var records = _context.PayrollRecords.ToList();
            return Ok(records);
        }

        // GET: Payroll by employeeId
        [HttpGet("{employeeId}")]
        public IActionResult GetByEmployee(int employeeId)
        {
            var records = _context.PayrollRecords
                                  .Where(p => p.EmployeeId == employeeId)
                                  .ToList();
            return Ok(records);
        }

        // POST: Create payroll
        [HttpPost]
        public IActionResult Create([FromBody] PayrollRecordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                //var today = DateTime.Today;
                var date = dto.PayDate;

                bool alreadyGenerated = _context.PayrollRecords
                    .Any(p => p.EmployeeId == dto.EmployeeId && p.PayDate.Year == date.Year && p.PayDate.Month == date.Month);

                if (alreadyGenerated)
                {
                    return BadRequest(new { message = "Payroll has already been generated for this month" });
                }

                /*
                var record = new PayrollRecord
                {
                    EmployeeId = dto.EmployeeId,
                    PayDate = dto.PayDate,
                    BaseSalary = dto.BaseSalary,
                    Bonus = dto.Bonus,
                    Deductions = dto.Deductions,
                };
                */

                var record = _mapper.Map<PayrollRecord>(dto);
                _context.PayrollRecords.Add(record);
                _context.SaveChanges();

                // Updating AnnualSalarySummery
                _empService.UpdateAnnualSalarySummary(record.EmployeeId, record.PayDate.Year);

                var responseDto = _mapper.Map<PayrollRecordDto>(record);

                // Get the summary of the current year
                //var summary = _empService.CalculateAnnualSalary(record.EmployeeId, record.PayDate.Year);
                // Get Employee
                var employee = _context.Employees.SingleOrDefault(e => e.EmployeeId == record.EmployeeId);

                if (employee == null)
                {
                    Console.WriteLine($"Employee not found for ID {record.EmployeeId} — skipping PDF.");

                }


                int empDbId = employee.Id;
                var totalNetPay = _empService.GetAnnualNetPay(empDbId, record.PayDate.Year);

                // create pdf 
                

                var document = new PayslipDocument(record, employee, totalNetPay);

                var filename = $"Payslip_{employee.EmployeeId}_{record.PayDate:yyyyMM}.pdf";

                var payslipDir = Path.Combine("wwwroot", $"payslips/{record.PayDate:yyyyMM}");

                if (!Directory.Exists(payslipDir))
                    Directory.CreateDirectory(payslipDir);


                var filePath = Path.Combine("wwwroot", $"payslips/{record.PayDate:yyyyMM}", filename);

                document.GeneratePdf(filePath);

                return Ok(responseDto);
            }
            catch (Exception ex)
            {

                return BadRequest($"Server Error: {ex.Message}");
            }
            
        }

        // PUT: Update payroll
        [HttpPut("{id}")]
        public IActionResult Update(int id, PayrollRecordDto updated)
        {
            var existing = _context.PayrollRecords.Find(id);
            if (existing == null) return NotFound();

            // Construct original PDF path
            var filename = $"Payslip_{existing.EmployeeId}_{existing.PayDate:yyyyMM}.pdf";

            var sourcePath = Path.Combine("wwwroot", $"payslips/{existing.PayDate:yyyyMM}", filename);

            var editedDir = Path.Combine("wwwroot", "Edited_Payslips/{existing.PayDate:yyyyMM}");

            // Ensure Edited folder exists
            if (!Directory.Exists(editedDir))
            {
                Directory.CreateDirectory(editedDir);
            }

            var destinationPath = Path.Combine(editedDir, filename);

            // Move the original file to edited directory if exists
            try
            {
                if (System.IO.File.Exists(sourcePath))
                {
                    System.IO.File.Move(sourcePath, destinationPath);
                }

                //existing = _mapper.Map<PayrollRecord>(updated); 

                
                existing.PayDate = updated.PayDate;
                existing.BaseSalary = updated.BaseSalary;
                existing.Bonus = updated.Bonus;
                existing.Deductions = updated.Deductions;
                existing.Status = updated.Status;
                existing.User = updated.User;
                existing.UpdatedOn = updated.UpdatedOn;
                

                _context.SaveChanges();
                // Updating AnnualSalarySummary
                _empService.UpdateAnnualSalarySummary(existing.EmployeeId, existing.PayDate.Year);

                // Get the summary of the current year
                //var summary = _empService.CalculateAnnualSalary(updated.EmployeeId, updated.PayDate.Year);


                // Find the Employee
                var employee = _context.Employees.SingleOrDefault(e => e.EmployeeId == existing.EmployeeId);

                if (employee == null)
                {
                    Console.WriteLine($"Employee not found for ID {existing.EmployeeId} — skipping PDF.");

                }


                //var document = new PayslipDocument(existing, employee, summary);

                var filenameEdited = $"Payslip_{employee.EmployeeId}_{existing.PayDate:yyyyMM}_edited.pdf";

                var payslipDir = Path.Combine("wwwroot", $"payslips/{existing.PayDate:yyyyMM}");
                if (!Directory.Exists(payslipDir))
                    Directory.CreateDirectory(payslipDir);


                var filePath = Path.Combine("wwwroot", "payslips", filenameEdited);

                //document.GeneratePdf(filePath);

                var response = _mapper.Map<PayrollRecordDto>(existing);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // DELETE: Remove payroll record
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var record = _context.PayrollRecords.Find(id);
            if (record == null) return NotFound(new { message = "Payslip not Found."});

            // Construct original PDF path
            var filename = $"Payslip_{record.EmployeeId}_{record.PayDate:yyyyMM}.pdf";
            var sourcePath = Path.Combine("wwwroot", $"payslips/{record.PayDate:yyyyMM}", filename);
            var deletedDir = Path.Combine("wwwroot", $"Deleted/{record.PayDate:yyyyMM}");

            // Ensure Deleted folder exists
            if (!Directory.Exists(deletedDir))
            {
                Directory.CreateDirectory(deletedDir);
            }

            var destinationPath = Path.Combine(deletedDir, filename);

            try
            {
                // Move PDF if it exists
                if (System.IO.File.Exists(sourcePath))
                {
                    System.IO.File.Move(sourcePath, destinationPath);
                }

                // Delete record from DB
                _context.PayrollRecords.Remove(record);
                _context.SaveChanges();
                return Ok(new { message = "Deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting payroll", error = ex.Message });
            }
        }

        [HttpPost("generate-currentMonthly")]
        public IActionResult GeneratePayrollForCurrentMonth([FromBody] MonthlyPayrollReq req)
        {
            //var today = DateTime.Today;
            //var firstOfMonth = new DateTime(today.Year, today.Month, 1);

            var employees = _context.Employees.ToList();
            var existingPayrolls = _context.PayrollRecords
                .Where(p => p.PayDate.Year == req.Date.Year && p.PayDate.Month == req.Date.Month)
                .Select(p => p.EmployeeId)
                .ToHashSet();

            bool alreadyGenerated = _context.PayrollRecords
                .Any(p => p.PayDate.Year == req.Date.Year && p.PayDate.Month == req.Date.Month);

            if (alreadyGenerated)
            {
                return BadRequest("Payroll has already been generated for this month");
            }

            var newPayrolls = employees
                .Where(e => !existingPayrolls.Contains(e.EmployeeId))
                .Select(e => new PayrollRecord
                {
                    EmployeeId = e.EmployeeId,
                    PayDate = req.Date,
                    BaseSalary = e.Salary,
                    Bonus = 0,
                    Deductions = 0,
                    Status = req.Status,
                    User = req.User,
                    UpdatedOn = req.UpdatedOn
                })
                .ToList();


            _context.PayrollRecords.AddRange(newPayrolls);
            _context.SaveChanges();

            

            foreach (var payroll in newPayrolls)
            {
                // Updating AnnualSalarySummery
                _empService.UpdateAnnualSalarySummary(payroll.EmployeeId, payroll.PayDate.Year);

                var employee = _context.Employees.SingleOrDefault(e => e.EmployeeId == payroll.EmployeeId);

                if (employee == null)
                {
                    Console.WriteLine($"Employee not found for ID {payroll.EmployeeId} — skipping PDF.");
                    continue;
                }

                int empDbId = employee.Id;
                var totalNetPay = _empService.GetAnnualNetPay(empDbId, payroll.PayDate.Year);


                var document = new PayslipDocument(payroll, employee, totalNetPay);

                var filename = $"Payslip_{employee.EmployeeId}_{payroll.PayDate:yyyyMM}.pdf";

                var payslipDir = Path.Combine("wwwroot", $"payslips/{payroll.PayDate:yyyyMM}_all");
                if (!Directory.Exists(payslipDir))
                    Directory.CreateDirectory(payslipDir);


                var filePath = Path.Combine("wwwroot", $"payslips/{payroll.PayDate:yyyyMM}_all", filename);

                try
                {
                    document.GeneratePdf(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("PDF generation failed:");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);
                }


            }

            return Ok(new { created = newPayrolls.Count });
        }

        [HttpPost("generate-monthly")]
        public IActionResult GeneratePayrollMonthly([FromBody] MonthlyPayrollReq req)
        {
            //var today = DateTime.Today;
            //var firstOfMonth = new DateTime(today.Year, today.Month, 1);


            var employees = _context.Employees.ToList();
            var existingPayrolls = _context.PayrollRecords
                .Where(p => p.PayDate.Year == req.Date.Year && p.PayDate.Month == req.Date.Month)
                .Select(p => p.EmployeeId)
                .ToHashSet();

            bool alreadyGenerated = _context.PayrollRecords
                .Any(p => p.PayDate.Year == req.Date.Year && p.PayDate.Month == req.Date.Month);

            if (alreadyGenerated)
            {
                return BadRequest("Payroll has already been generated for the month");
            }

            var newPayrolls = employees
                .Where(e => !existingPayrolls.Contains(e.EmployeeId))
                .Select(e => new PayrollRecord
                {
                    EmployeeId = e.EmployeeId,
                    PayDate = req.Date,
                    BaseSalary = e.Salary,
                    Bonus = 0,
                    Deductions = 0,
                    Status = req.Status,
                    User = req.User,
                    UpdatedOn = req.UpdatedOn
                })
                .ToList();


            _context.PayrollRecords.AddRange(newPayrolls);
            _context.SaveChanges();



            foreach (var payroll in newPayrolls)
            {
                // Updating AnnualSalarySummery
                _empService.UpdateAnnualSalarySummary(payroll.EmployeeId, payroll.PayDate.Year);

                var employee = _context.Employees.SingleOrDefault(e => e.EmployeeId == payroll.EmployeeId);

                if (employee == null)
                {
                    Console.WriteLine($"Employee not found for ID {payroll.EmployeeId} — skipping PDF.");
                    continue;
                }

                int empDbId = employee.Id;
                var totalNetPay = _empService.GetAnnualNetPay(empDbId, payroll.PayDate.Year);


                var document = new PayslipDocument(payroll, employee, totalNetPay);

                var filename = $"Payslip_{employee.EmployeeId}_{payroll.PayDate:yyyyMM}.pdf";

                var payslipDir = Path.Combine("wwwroot", $"payslips/{payroll.PayDate:yyyyMM}_all");
                if (!Directory.Exists(payslipDir))
                    Directory.CreateDirectory(payslipDir);


                var filePath = Path.Combine("wwwroot", $"payslips/{payroll.PayDate:yyyyMM}_all", filename);

                try
                {
                    document.GeneratePdf(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("PDF generation failed:");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);
                }


            }

            return Ok(new { created = newPayrolls.Count });
        }

        [HttpGet("download-zip/{month}")]
        public IActionResult DownloadPayslipZip(string month)
        {
            var zipFileName = $"Payslips_{month}.zip";
            var zipPath = Path.Combine("wwwroot", $"payslips/{month}_all", zipFileName);
            var payslipDir = Path.Combine("wwwroot", $"payslips/{month}_all");

            // Optional: Filter files by month
            var pdfFiles = Directory.GetFiles(payslipDir, $"*_{month}.pdf");

            if (System.IO.File.Exists(zipPath))
                System.IO.File.Delete(zipPath);

            using (var zipArchive = ZipFile.Open(zipPath, ZipArchiveMode.Create))
            {
                foreach (var file in pdfFiles)
                {
                    zipArchive.CreateEntryFromFile(file, Path.GetFileName(file));
                }
            }

            var fileBytes = System.IO.File.ReadAllBytes(zipPath);
            return File(fileBytes, "application/zip", zipFileName);
        }

        [HttpGet("download-payslip/{employeeId}/{year}/{month}")]
        public IActionResult DownloadPayslip(int employeeId, int year, int month)
        {
            string filename;
            string filePath;
            var filePattern = $"Payslip_{employeeId}_{year}{month:D2}*.pdf";
            //var edited_filename = $"Payslip_{employeeId}_{year}{month:D2}_edited.pdf";

            var folderPath = Path.Combine("wwwroot", $"payslips/{year}{month:D2}");
            //var filePath_edit = Path.Combine("wwwroot", "payslips", edited_filename);

            // Search for matching file
            string[] matchingFiles = Directory.GetFiles(folderPath, filePattern);

            if (matchingFiles.Length > 0)
            {
                //return NotFound(new { message = "Payslip not found." });
                filePath = matchingFiles[0];
                filename = Path.GetFileName(filePath);
                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, "application/pdf", filename);
            }
            else
            {
                filename = $"Payslip_{employeeId}_{year}{month:D2}.pdf";
                filePath = Path.Combine("wwwroot", $"payslips/{year}{month}", filename);
                var employee = _context.Employees.SingleOrDefault(e => e.EmployeeId == employeeId);

                if (employee == null)
                {
                    Console.WriteLine($"Employee not found for ID {employee.EmployeeId} — skipping PDF.");
                }
                

                var record = _context.PayrollRecords.SingleOrDefault(r => r.EmployeeId == employeeId);

                //var summary = _empService.CalculateAnnualSalary(record.EmployeeId, record.PayDate.Year);


                //var document = new PayslipDocument(record, employee, summary);

                //var filename = $"Payslip_{employee.EmployeeId}_{payroll.PayDate:yyyyMM}.pdf";

                var payslipDir = Path.Combine("wwwroot", $"payslips/{year}{month}");
                if (!Directory.Exists(payslipDir))
                    Directory.CreateDirectory(payslipDir);


                //var filePath = Path.Combine("wwwroot", "payslips", filename);

                //document.GeneratePdf(filePath);

            }

            return NotFound(new { message = "Payslip doesn't exist in the folder or the employeeId is not correct!"});

            
        }


    }
}
