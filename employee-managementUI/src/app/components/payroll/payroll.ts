import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayrollService } from '../../services/payroll-service';
import { PayrollRecord } from '../../models/payrollModel';
import { EmpService } from '../../services/emp-service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastrService} from 'ngx-toastr';
import { BdtFormatPipe } from '../../pipe/bdt-format-pipe';



@Component({
  selector: 'app-payroll',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BdtFormatPipe],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css'
})
export class Payroll implements OnInit{
  @ViewChild('payslipToPrint') payslipToPrint!: ElementRef;
  payrollList: PayrollRecord[] = [];
  form!: FormGroup;
  editingId: number | null = null;
  filterMonth = '';
  filterMonthControl = new FormControl('');
  filteredList: PayrollRecord[] = [];
  payrollThisMonth: PayrollRecord[] = [];
  totalPayrollThisMonth = 0;
  selectedRecord: PayrollRecord | null = null;
  employeeInfo: any;
  payrollBatch: any;

  fullName: any;
  isDrawerOpen: boolean = false;

  touched: boolean = false;
  inputValue: Date = new Date();
  genMessage = '';
  

  constructor(private fb: FormBuilder, 
    private payrollService: PayrollService,
    private empService: EmpService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

// Then use:
//payDate: [formattedDate, Validators.required]


    this.form = this.fb.group({
      employeeId: [null, Validators.required],
      payDate: [formattedDate, Validators.required],
      baseSalary: [null, Validators.required],
      bonus: [null],
      deductions: [null]
    });

    this.loadPayroll();
    this.updatePayrollSummary();
  }

  downloadPayslip() {
  html2canvas(this.payslipToPrint.nativeElement,
    { scale: 3 }).then(canvas => {
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(img, 'png', 0, 0, canvas.width, canvas.height);
    pdf.save(`Payslip-${this.selectedRecord?.employeeId || 'employee'}.pdf`);
  });
}

  loadPayroll() {
    this.payrollService.getAll().subscribe({
      next: data => {
        this.payrollList = data;
        this.filteredList = [...data]; // default: show all
        //this.applyFilter();
        this.updatePayrollSummary();
      }
    });
  }

  onEmpIdEnter(event: any): void {
    event.preventDefault(); // stops the form from submitting
  const empId = Number(this.form.get('employeeId')?.value);

  if (Number.isInteger(empId) && empId > 0) {
    this.empService.getEmpByEmpId(empId).subscribe({
      next: employee => {
        if (employee) {
          this.employeeInfo = employee;
          this.form.patchValue({ baseSalary: employee.salary });
        }
      },
      error: () => {
        this.employeeInfo = null;
        this.form.patchValue({ baseSalary: 0 });
      }
    });
  } else {
    this.form.patchValue({ baseSalary: 0 });
  }
}


  submit() {

    if (this.form.invalid) {
      console.log('the form is invalid');
      return;
    }

    const payload = {
      employeeId: Number(this.form.value.employeeId),
      payDate: this.form.value.payDate,
      baseSalary: Number(this.form.value.baseSalary),
      bonus: this.form.value.bonus === '' ? 0 : Number(this.form.value.bonus),
      deductions: this.form.value.deductions === '' ? 0 : Number(this.form.value.deductions),
      status: (() => this.editingId ? 'Corrected' : 'Original')(),
      user: this.username,
      updatedOn: new Date().toISOString().split('T')[0]
    }

    console.log('Sending Payload: ', payload);
    
    if (this.editingId) {
      const formattedPayload = {
        ...payload,
      };

      this.payrollService.updatePayroll(this.editingId, payload).subscribe({
        next: () => {
          this.editingId = null;
          //this.form.reset();
          //this.loadPayroll();
          this.toastr.success('Updated Successfully');
          this.ngOnInit();
        },
        error: () => {
          this.toastr.error('Unable to update!');
        }
      });
    }
    else {
      this.payrollService.createPayroll(payload).subscribe({
        next: () => {

          //this.form.reset();
          this.toastr.success('Payroll created successfully');
          this.ngOnInit();
          //this.loadPayroll();
        },
        error: err => {
          this.toastr.error('Failed to create payroll');
          console.error(err);
        }
      });
    }
  }

  editPayroll(record: PayrollRecord) {
    this.editingId = record.id;
    const formattedRecord = {
      ...record,
      payDate: typeof record.payDate === 'string'
        ? record.payDate.slice(0, 10)
        : ''
    };
    this.form.patchValue(formattedRecord);
  }

  deletePayroll(id: number) {
    this.payrollService.deletePayroll(id).subscribe({
      next: () => {
        this.toastr.success('Payslip Deleted');
        this.loadPayroll();
      },
      error: () => {
        this.toastr.error('Unable to Delete!!');
      }
    });
  }


  applyFilter() {

    const value = this.filterMonthControl.value;
    if (!value) {
      this.filteredList = [...this.payrollList];
      return;
    }

    const [year, month] = value.split('-').map(Number);
    this.filteredList = this.payrollList.filter(record => {
      const payDate = new Date(record.payDate);
      return payDate.getFullYear() === year && (payDate.getMonth() + 1) === month;
    });
  }

  clearFilter() {
    this.filterMonthControl.setValue('');
    this.filteredList = [...this.payrollList];
  }

  exportCSV() {
  const data = this.filteredList.length ? this.filteredList : this.payrollList;
  const headers = ['EmployeeId', 'PayDate', 'BaseSalary', 'Bonus', 'Deductions', 'NetPay'];
  const rows = data.map(r => `${r.employeeId},${r.payDate},${r.baseSalary},${r.bonus},${r.deductions},${r.baseSalary + r.bonus - r.deductions}`);
  const csv = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'payroll.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

updatePayrollSummary() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  this.payrollThisMonth = this.payrollList.filter(r => {
    const date = new Date(r.payDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  this.totalPayrollThisMonth = this.payrollThisMonth.reduce((total, r) =>
    total + r.baseSalary + r.bonus - r.deductions, 0);
}

get netPay(): number {
  const salary = Number(this.form.value.baseSalary || 0);
  const bonus = Number(this.form.value.bonus || 0);
  const deductions = Number(this.form.value.deductions || 0);

  /*
  if (!this.selectedRecord) return 0;

  const { baseSalary, bonus, deductions } = this.selectedRecord;
  */
  return salary + bonus - deductions;
}

selectRecord(record: PayrollRecord) {
  this.selectedRecord = record;
}

onEmployeeIdChange(id: number) {
  this.empService.getEmp(id).subscribe({
    next: data => this.employeeInfo = data,
    error: () => this.employeeInfo = null
  });
}

generatePayrollBatch() {
  const payload = {
    status: (() => this.editingId ? 'Corrected' : 'Original')(),
    user: this.username,
    updatedOn: new Date().toISOString().split('T')[0],
    date: new Date().toISOString(),
    //record: this.payrollBatch
  };

  this.payrollService.generateCurrentMonthlyPayroll(this.payrollBatch, payload).subscribe({
    next: (res: any) => {
      this.toastr.success(`${res.created} payroll records created.`);
      this.ngOnInit();  // Refresh the list
    },
    error: err => {
      this.toastr.error(err.error);
      console.error(err.error);
    }
  });
}

generateMonthlyPayroll() {

  const payload = {
    status: (() => this.editingId ? 'Corrected' : 'Original')(),
    user: this.username,
    updatedOn: new Date().toISOString().split('T')[0],
    date: this.inputValue,
    //record: this.payrollBatch
  };

  this.payrollService.generateMonthlyPayroll(this.payrollBatch, payload).subscribe({
    next: (res: any) => {
      this.toastr.success(`${res.created} payroll records created.`);
      this.ngOnInit();
    },
    error: err => {
      this.toastr.error(err.error);
      console.error(err);
    }
  });
}

downloadPayslipArchive() {
  const month = new Date().toISOString().substring(0, 7).replace('-', ''); // e.g., "202507"
  this.payrollService.downloadPayslipArchive(month).subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Payslips_${month}.zip`;
    link.click();
  });
}

downloadPayslipFromBackend(record: PayrollRecord) {
  
  const empId = record.employeeId;
  const date = new Date(record.payDate);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  this.payrollService.downloadPayslipByEmp(empId, year, month).subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Payslip_${empId}_${year}${month}.pdf`;
    link.click();
  });

  this.payrollService.downloadPayslipByEmp(empId, year, month).subscribe({
    next: blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Payslip_${empId}_${year}${month}.pdf`;
      link.click();
      this.toastr.success('Downloaded Successfully!');
    },
    error: err => {
      this.toastr.error('Payroll not found!');
    }
    
  });
}

get username(): string | null {
    return localStorage.getItem('username');
  }

toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

}
