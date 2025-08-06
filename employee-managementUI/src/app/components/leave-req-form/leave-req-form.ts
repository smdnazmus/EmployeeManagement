import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveService } from '../../services/leave-service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Employee } from '../../models/employeeModel';
import { EmpService } from '../../services/emp-service';
import { FilterPipe } from '../../pipe/filter-pipe-pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LeaveReq } from '../../models/leaveReqModel';
import { EventTypeDialog } from '../event-type-dialog/event-type-dialog';


@Component({
  selector: 'app-leave-req-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule, MatDatepickerModule, MatAutocompleteModule],
  templateUrl: './leave-req-form.html',
  styleUrl: './leave-req-form.css'
})
export class LeaveReqForm implements OnInit{
  leaveForm!: FormGroup;
  filteredEmployees: any[] = [];
  employees: Employee[] = []; // from service or static

  leaveReq!: LeaveReq;

  constructor(
    private empService: EmpService,
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<LeaveReqForm>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date },
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmps();
    
    this.leaveForm = this.fb.group({
      employeeName: [''],
      employeeId: [{value: '', disabled: true}],
      leaveType: ['', [Validators.required]],
      startDate: [this.data.selectedDate, [Validators.required]],
      endDate: [this.data.selectedDate, [Validators.required]],
      reason: ['']
    });
    this.leaveForm.get('employeeName')!.valueChanges.subscribe(value => {
      this.filteredEmployees = new FilterPipe().transform(this.employees, value)
    });
  }

  onSearchChange(): void {
  const searchValue = this.leaveForm.get('name')?.value || '';
  this.filteredEmployees = new FilterPipe().transform(this.employees, searchValue);
}


  loadEmps() {
    this.empService.getEmps().subscribe(data => {
      this.employees = data;
    });
  }

 selectEmployee(employee: Employee): void {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  this.leaveForm.patchValue({
    employeeName: fullName,
    employeeId: employee.employeeId
  });
}


  submitLeave(): void {
    if (this.leaveForm.valid) {
      const leaveData = {
        employeeId: this.leaveForm.getRawValue().employeeId,
        leaveType: this.leaveForm.value.leaveType,
        startDate: this.leaveForm.value.startDate,
        endDate: this.leaveForm.value.endDate,
        reason: this.leaveForm.value.reason
        //status: this.leaveReq.status
      };

      console.log(leaveData);

      this.leaveService.submitLeave(leaveData).subscribe({
        next: res => {
          this.toastr.success(res.message || 'Leave submitted');
          this.dialogRef.close('submitted'); // Close modal
        },
        error: err => {
          console.error(err);
          this.toastr.error('Submission failed');
        }
      });
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }

  goBack() {
      this.dialogRef.close();
      this.dialog.open(EventTypeDialog, {
        width: '400px',
        autoFocus: false
      });
    }
}
