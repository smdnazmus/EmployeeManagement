import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CompanyIncome } from '../../models/incomeModel';
import { CompanyExpense } from '../../models/expenseModel';
import { FinanceService } from '../../services/finance-service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BdtFormatPipe } from "../../pipe/bdt-format-pipe";

@Component({
  selector: 'app-finance',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BdtFormatPipe],
  templateUrl: './finance.html',
  styleUrl: './finance.css'
})
export class Finance implements OnInit{

  incomes: CompanyIncome[] = [];
  expenses: CompanyExpense[] = [];
  incomeFilter = false;
  editingId: number | null = null;

  totalIncome = 0;
  totalExpense = 0;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;

  currentMonth = '';
  filterMonthControl = new FormControl('');
  filteredIncomeList: CompanyIncome[] = [];
  filteredExpenseList: CompanyExpense[] = [];

  incomeDrawerOpen = false;
  expenseDrawerOpen = false;
  reportDrawerOpen = false;

  incomeForm!: FormGroup;
  expenseForm!: FormGroup;
  isEditingIncome = false;
  isEditingExpense = false;
  selectedIncome: CompanyIncome | null = null;
  selectedExpense: CompanyExpense | null = null;

  filter = false;
  filterMonth!: number;
  filterYear!: number;
  selectedMonth: any;
  selectedYear: any;
  selectedYearForYearly: number = new Date().getFullYear();

  months: string[] = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('default', { month: 'long' })
  );

  years: number[] = [];

  constructor(private financeService: FinanceService, private toastr: ToastrService, private fb: FormBuilder){}

  ngOnInit(): void {

    for (let i = this.year - 4; i <= this.year; i++){
      this.years.push(i);
    }

    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
    this.selectedYear = this.year;
    this.selectedYearForYearly = this.year;
     
    this.incomeForm = this.fb.group({
      source: [''],
      amount: [0],
      date: [new Date().toISOString().split('T')[0]],
      description: ['']
    });

    this.expenseForm = this.fb.group({
      catagory: [''],
      amount: [0],
      date: [new Date()],
      description: ['']
    });

    if(!this.filter) {
     
      this.loadIncome(this.year, this.month);
      this.loadExpense(this.year, this.month);
      this.currentMonthlySummary();
    }
   
  }

  loadIncome(year: number, month: number) {
    // Load monthly incomes
    this.financeService.getIncomeListMonthly(year, month).subscribe({
      next: (res: any) => {
        this.incomes = res;
        //this.toastr.success(res.message);
      },
      error: err => {
        this.toastr.error(err.error.message);
        console.error(err);
      }
    });

    
  }

  loadExpense(year: number, month: number) {
    // Load monthly expenses
    this.financeService.getExpenseListMonthly(year, month).subscribe({
      next: (res: any) => {
        this.expenses = res;
      },
      error: err => {
        this.toastr.error(err.error.message);
        console.error(err);
      }
    });
  }

  getMonthDate(month: number, year: number): Date {
  if (!month || !year || isNaN(month) || isNaN(year)) {
    return new Date(); // fallback to current date
  }
  return new Date(year, month - 1, 1); // zero-based month
}


  openIncomeDrawer() {
  this.incomeDrawerOpen = true;
  }

  closeIncomeDrawer() {
  this.incomeDrawerOpen = false;
  }
  openExpenseDrawer() {
    this.expenseDrawerOpen = true;
  }
  closeExpenseDrawer() {
    this.expenseDrawerOpen = false;
  }

  openReportDrawer() {
    this.reportDrawerOpen = true;
  }

  closeReportDrawer() {
    this.reportDrawerOpen = false;
  }

  openIncomeDrawerForUpdate(income: CompanyIncome) {
    this.incomeDrawerOpen = true;
    this.isEditingIncome = true;
    this.selectedIncome = income;
    this.incomeForm.patchValue(income);
  }

  openExpenseDrawerForUpdate(expense: CompanyExpense) {
    this.expenseDrawerOpen = true;
    this.isEditingExpense = true;
    this.selectedExpense = expense;
    this.expenseForm.patchValue(expense);
  }

  resetIncomeDrawer() {
  this.incomeForm.reset();
  this.incomeDrawerOpen = false;
  this.isEditingIncome = false;
  this.selectedIncome = null;
}

resetExpenseDrawer() {
  this.expenseForm.reset();
  this.expenseDrawerOpen = false;
  this.isEditingExpense = false;
  this.selectedExpense = null;
}


  submitIncome() {
    if (this.incomeForm.invalid) {
      return;
    }

    if (this.isEditingIncome && this.selectedIncome) {
      const payload = this.incomeForm.value;
      this.financeService.updateIncome(this.selectedIncome.id, payload).subscribe({
        next: res => {
          this.editingId = null;
          this.toastr.success("Updated Successfully!");
          this.ngOnInit();
          this.closeIncomeDrawer();
        },
        error: err => {
          this.toastr.error("Update Error!");
          this.closeIncomeDrawer();
        }
      });
    }
    else {
      this.financeService.createIncome(this.incomeForm.value).subscribe({
        next: res => {
          //this.loadIncome(this.year, this.month);
         
          this.toastr.success("Added Successfully!");
          this.ngOnInit();
          this.closeIncomeDrawer();
        },
        error: err => {
          this.toastr.error("Unable to add the income!");
          this.closeIncomeDrawer();
        }
      });
    }
  }

  deleteIncome(id: number) {
    this.financeService.deleteIncome(id).subscribe({
      next: () => {
        this.toastr.success("Deleted Successfully!");
        this.ngOnInit();
      },
      error: () => {
        this.toastr.error("Error deleting..!");
      }
    });
  }

  submitExpense() {
    if (this.expenseForm.invalid) {
      return;
    }

    if (this.isEditingExpense && this.selectedExpense) {
      const payload = this.expenseForm.value;
      this.financeService.updateExpense(this.selectedExpense.id, payload).subscribe({
        next: res => {
          this.editingId = null;
          this.toastr.success("Updated Successfully!");
          this.ngOnInit();
          this.closeExpenseDrawer();
        },
        error: err => {
          this.toastr.error("Update Error!");
          this.closeExpenseDrawer();
        }
      });
    }
    else {
      this.financeService.createExpense(this.expenseForm.value).subscribe({
        next: res => {
          //this.loadIncome(this.year, this.month);
         
          this.toastr.success("Added Successfully!");
          this.ngOnInit();
          this.closeExpenseDrawer();
        },
        error: err => {
          this.toastr.error("Unable to add the income!");
          this.closeExpenseDrawer();
        }
      });
    }
  }

    deleteExpense(id: number) {
    this.financeService.deleteExpense(id).subscribe({
      next: () => {
        this.toastr.success("Deleted Successfully!");
        this.ngOnInit();
      },
      error: () => {
        this.toastr.error("Error deleting..!");
      }
    });
  }

  currentMonthlySummary() {
    this.financeService.getSummary(this.year, this.month).subscribe({
      next: res =>{
        //console.log(res);
        this.totalIncome = res.totalIncome;
        this.totalExpense = res.totalExpense;
      }
    });
  }

  monthlySummery(year: number, month: number, context: 'income' | 'expense' | 'both') {
    this.financeService.getSummary(year, month).subscribe({
      next: res => {
        //console.log(res);
        if (context === 'income') {
          this.totalIncome = res.totalIncome;
        }

        if (context === 'expense') {
          this.totalExpense = res.totalExpense;
        }

        if (context === 'both') {
          this.totalIncome = res.totalIncome;
          this.totalExpense = res.totalExpense;
        }
        
      }
    });
  }

   applyIncomeFilter() {
    this.filter = true;
    //this.incomeFilter = true;
    const value = this.filterMonthControl.value;
    if (!value) {
      this.filteredIncomeList = [...this.incomes];
      //this.incomeFilter = false;
      this.filter = false;
      return;
    }

    const [year, month] = value.split('-').map(Number);
    this.financeService.getIncomeListMonthly(year, month).subscribe({
      next: res => {
        this.incomes = res;
        this.filterMonth = month;
        this.filterYear = year;
        this.monthlySummery(year, month, 'income');
        this.filter = false;
        //this.incomeFilter = false;
        
      }
    });
  }

  clearIncomeFilter() {
    this.filterMonthControl.setValue('');
    //this.filteredIncomeList = [...this.incomes];
    this.ngOnInit();
  }

  applyExpenseFilter() {
    this.filter = true;
    const value = this.filterMonthControl.value;
    if (!value) {
      this.filteredExpenseList = [...this.expenses];
      return;
    }

    const [year, month] = value.split('-').map(Number);
    this.financeService.getExpenseListMonthly(year, month).subscribe({
      next: res => {
        //this.filteredIncomeList = res;
        //this.ngOnInit();
        //this.loadIncome();
        this.expenses = res;
        this.monthlySummery(year, month, 'expense');
        //this.ngOnInit();
        this.filter = false;
        
      }
    });
  }

  clearExpenseFilter() {
    this.filterMonthControl.setValue('');
    this.ngOnInit();
  }


  downloadReport() {
    const monthNumber = this.months.indexOf(this.selectedMonth) + 1;
    this.financeService.downloadReport(this.selectedYear, monthNumber).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Finance_Report_${this.selectedMonth}_${this.selectedYear}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  downloadYearlyReport() {
    this.financeService.downloadYearlyReport(this.selectedYearForYearly).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Finance_Report_${this.selectedYear}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }



  
}
