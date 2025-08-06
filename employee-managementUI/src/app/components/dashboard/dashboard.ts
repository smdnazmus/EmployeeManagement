import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employeeModel';
import { EmpService } from '../../services/emp-service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {  CalendarModule, CalendarMonthViewComponent, DateAdapter } from 'angular-calendar';
import { FilterPipe } from "../../pipe/filter-pipe-pipe";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { LeaveReqForm } from '../leave-req-form/leave-req-form';
import { LeaveService } from '../../services/leave-service';
import { count } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EventTypeDialog } from '../event-type-dialog/event-type-dialog';
import { Todoform } from '../todoform/todoform';
import { Todoservice } from '../../services/todoservice';
import { ToDo } from '../../models/todo';
import { CalendarService, HolidayDto } from '../../services/calendar-service';
import { CalendarEventForm } from '../calendar-event-form/calendar-event-form';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewEncapsulation } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BsDatepickerModule, FilterPipe, FormsModule, RouterLink, MatCardModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  encapsulation: ViewEncapsulation.None
})
export class Dashboard implements OnInit{

  apiBaseUrl = environment.apiBaseUrl;
  emps: Employee[] = [];
  filteredPendingList: any[] = [];
  searchTerm = '';
  birthdaysToday = 3;
  //todoList = ['Review payroll', 'Approve Leave', 'Team Meeting at 3 PM'];
  todoList: ToDo[] = [];

  pendingCount: number = 0;

  showPendingModal = false;

  pendingReqs: any[] = [];

  employees = [
    { name: 'Alice', department: 'HR'},
    { name: 'Bob', department: 'Tech'}
  ];

  quickActions = [
    { label: 'Add Employee', action: 'add'},
    { label: 'View Payroll', action: 'payroll'}
  ];
/*
  notifications = [
    'Quaterly meeting - Aug 5',
    'Company Picnic - Aug 15',
    'Welness workshop - Aug 20' 
  ];
*/
  notifications: HolidayDto[] = [];

  holidays: any[] = [];
  events: HolidayDto[] = [];

  holidaysLoaded = false;
  eventsLoaded = false;


  constructor(
    private calendarService: CalendarService, 
    private empService: EmpService, 
    private dialog: MatDialog, 
    private leaveService: LeaveService, 
    private toastr: ToastrService, 
    private todoService: Todoservice,
    private cdr: ChangeDetectorRef
  ) {
    //this.dateClass = this.dateClass.bind(this);
  }

  ngOnInit(): void {
    this.loadEmps();
    this.loadAllLeaves();
    this.loadTodoList();
    this.loadEvents();
    this.loadHolidays();
    this.loadAllEvents();

    this.leaveService.updatePendingCount();

    this.leaveService.pendingCount$.subscribe({
      next: count => {
        this.pendingCount = count;
      }
    });
  }

  loadHolidays() {
    const today = new Date();
    const year = today.getFullYear();
    this.calendarService.getYearlyHolidays(year).subscribe({
      next: res => {
        this.holidays = res;
        this.holidaysLoaded = true;
  
        //console.log(this.holidays);
        //this.cdr.detectChanges();
      },
      error: err => {
        this.toastr.error('Unable to load the holidays. Please contact service provider.');
      }
    });
  }

  loadAllEvents() {
    const today = new Date();
    const year = today.getFullYear();

    this.calendarService.getAllEvents(year).subscribe({
      next: res => {
        this.events = res;
        this.eventsLoaded = true;
        //console.log(this.events);
        this.cdr.detectChanges();
      },
      error: err => {
        this.toastr.error('Unable to laod the events. Please contact the service provider.');
      }
    });
  }

  loadEvents(){
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    this.calendarService.getCalendarEvents(year, month).subscribe({
      next: res => {
        this.notifications = res;
      },
      error: err => {
        this.toastr.error('Unable to load notifications. Please contact service provider.');
      }
    })
  }

  loadEmps() {
    this.empService.getEmps().subscribe(data => {
      this.emps = data;
    });
  }
  get totalEmployees(): number {
    return this.emps.length;
  }

  loadTodoList() {
    let date = new Date();
    console.log(date);
    this.todoService.getTaskByDate(date).subscribe({
      next: res => {
        this.todoList = res;
      }, 
      error: err => {
        this.toastr.error('Unable to load the data. Contact service provider.');
      }
    });
  }



  /** Calendar click opens modal with form */
    onDateClick(date: Date): void {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl?.classList.contains('mat-calendar-body-cell')) {
        activeEl.blur();
      }

      const typeDialogRef = this.dialog.open(EventTypeDialog, {
        width: '400px',
        autoFocus: false
      });

      typeDialogRef.afterClosed().subscribe(type => {
        if (!type) return;

        let formComponent: any;

        switch (type) {
          case 'leave': 
            formComponent = LeaveReqForm;
            break;
          case 'todo':
            formComponent = Todoform;
            break;
          case 'event':
            formComponent = CalendarEventForm;
            break;
        }

        if (formComponent) {
          const dialogRef = this.dialog.open(formComponent, {
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
      });
        }
      });
    }

    loadAllLeaves(): void {
    this.leaveService.getAllLeaves().subscribe({
      next: data => {
        this.filteredPendingList = [...data];
        this.pendingReqs = this.filteredPendingList.filter(l => l.status === 'Pending');
      }, 
      error: () => this.toastr.error("Error loading all leaves.")
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

  openPendingModal() {
    this.showPendingModal = true;
    //console.log('Modal open:', this.showPendingModal); // Add this line
  }

  closePendingModal() {
    this.showPendingModal = false;
    this.ngOnInit();
  }

  

// ... other component code

dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
  if (date === null) {
    return '';
  }

  const d = date as Date;

  const day = d.getDay();
  
  // Use local date methods to get a timezone-agnostic date string
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const dayOfMonth = d.getDate().toString().padStart(2, '0');
  
  const dateStr = `${year}-${month}-${dayOfMonth}`;

  const classes: string[] = [];

  if (day === 5) {
    classes.push('friday');
  }

  // Normalize your holiday dates for comparison
  const normalizedHolidayDates = this.holidays.map(h => h.date.split('T')[0]);
  if (normalizedHolidayDates.includes(dateStr)) {
    classes.push('holiday');
  }

  // Normalize your event dates for comparison
  const normalizedEventDates = this.events.map(event => event.date.split('T')[0]);
  if (normalizedEventDates.includes(dateStr)) {
    classes.push('event');
  }
/*
  console.log('Checking date:', dateStr);
  console.log('Normalized Holidays:', normalizedHolidayDates);
  console.log('Normalized Events:', normalizedEventDates);
*/
  return classes.join(' ');
};
}
