import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  get fullName(): string | null {
    return localStorage.getItem('fullname');
  }

}
