import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class adminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (token && role === 'Admin') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
};