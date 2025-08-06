import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaveReq } from '../../models/leaveReqModel';
import { LeaveService } from '../../services/leave-service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LeaveReqForm } from '../leave-req-form/leave-req-form';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EmpService } from '../../services/emp-service';

@Component({
  selector: 'app-leave-request',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatDatepickerModule],
  templateUrl: './leave-request.html',
  styleUrl: './leave-request.css'
})
export class LeaveRequest implements OnInit{
  searchEmployeeId: number = 0;
  employeeLeaves: LeaveReq[] = [];
  allLeaves: any[] = [];
  filteredList: any[] = [];
  filterStatus = 'Pending';
  //groupedLeaves: any[] = [];

  openedMonths: { [key: string]: boolean } = {};

  //groupedLeaves: [month: string, records: any[]][] = [];
  groupedLeaves: { [month: string]: any[] } = {};



  constructor(
    private leaveService: LeaveService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private empService: EmpService
  ) {}

  ngOnInit(): void {
    this.loadAllLeaves(); // or loadAllLeaves() depending on role
    //this.leaveService.updatePendingCount();

    const currentMonthKey = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    this.openedMonths[currentMonthKey] = true;

    
  }

  /** Calendar click opens modal with form */
  onDateClick(date: Date): void {
  const dialogRef = this.dialog.open(LeaveReqForm, {
    width: '500px',
    autoFocus: false,
    restoreFocus: false,
    data: { selectedDate: date }
  });

  dialogRef.afterOpened().subscribe(() => {
    // Focus dialog container
    const dialogContainer = document.querySelector('.mat-dialog-container') as HTMLElement;
    if (dialogContainer) {
      dialogContainer.setAttribute('tabindex', '-1');
      dialogContainer.focus();
    }

    // Make main content inert
    document.querySelector('#mainContent')?.setAttribute('inert', '');

    // Remove aria-hidden from <app-root> if injected
    const appRoot = document.querySelector('app-root');
    if (appRoot?.hasAttribute('aria-hidden')) {
      appRoot.removeAttribute('aria-hidden');
      appRoot.setAttribute('inert', '');
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    // Re-enable background content
    document.querySelector('#mainContent')?.removeAttribute('inert');

    // Clean up <app-root>
    const appRoot = document.querySelector('app-root');
    if (appRoot?.hasAttribute('inert')) {
      appRoot.removeAttribute('inert');
    }
    if (result === 'submitted') {
      this.ngOnInit();
    }
  });
}



toggleMonth(monthKey: string): void {
  this.openedMonths[monthKey] = !this.openedMonths[monthKey];
}



  loadAllLeaves(): void {
    this.leaveService.getAllLeaves().subscribe({
      next: data => {
        this.allLeaves = data;
        this.filteredList = [...data];
        this.groupedLeaves = this.groupByMonth(this.filteredList);
      }, 
      error: () => this.toastr.error("Error loading all leaves.")
    });
  }

  loadEmployeeLeaves(): void {
    this.leaveService.getLeavesForEmployee(this.searchEmployeeId).subscribe({
      next: res => this.employeeLeaves = res,
      error: () => this.toastr.error("Error loading employee leaves.")
    });
  }

  approveLeave(id: number): void {
    if (!id) return;
    this.leaveService.approveLeave(id).subscribe({
      next: () => this.loadAllLeaves()
    });
  }

  rejectLeave(id: number): void {
    if (!id) return;
    this.leaveService.rejectLeave(id).subscribe({
      next: () => this.loadAllLeaves()
    });
  }

  get leaveHistory(): LeaveReq[] {
    return this.allLeaves;
  }

 

  groupByMonth(leaves: any[]): { [month: string]: any[] } {
  const result: { [month: string]: any[] } = {};

  for (const leave of leaves) {
    const date = new Date(leave.startDate);
    const monthKey = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    if (!result[monthKey]) result[monthKey] = [];
    result[monthKey].push(leave);
  }

  for (const month in result) {
    result[month].sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return 0;
    });
  }

  return result;
}




  
}
