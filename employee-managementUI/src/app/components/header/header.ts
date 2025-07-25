import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
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
