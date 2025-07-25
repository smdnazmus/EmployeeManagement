import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-speedometer2' },
    { label: 'Emplyoees', path: '/employees', icon: 'bi bi-people' },
    { label: 'Payroll', path: '/payroll', icon: 'bi bi-credit-card' },
    { label: 'Finance', path: '/finance', icon: 'bi bi-coin'}
  ];


}
