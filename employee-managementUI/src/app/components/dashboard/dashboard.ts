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



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BsDatepickerModule, FilterPipe, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{
  apiBaseUrl = environment.apiBaseUrl;
  emps: Employee[] = [];
  searchTerm = '';
  birthdaysToday = 3;
  todoList = ['Review payroll', 'Approve Leave', 'Team Meeting at 3 PM'];

  employees = [
    { name: 'Alice', department: 'HR'},
    { name: 'Bob', department: 'Tech'}
  ];

  quickActions = [
    { label: 'Add Employee', action: 'add'},
    { label: 'View Payroll', action: 'payroll'}
  ];

  notifications = [
    'Quaterly meeting - Aug 5',
    'Company Picnic - Aug 15',
    'Welness workshop - Aug 20' 
  ];

  constructor(private empService: EmpService) {}
  ngOnInit(): void {
    this.loadEmps();
  }

  loadEmps() {
    this.empService.getEmps().subscribe(data => {
      this.emps = data;
    });
  }
  get totalEmployees(): number {
    return this.emps.length;
  }
}
