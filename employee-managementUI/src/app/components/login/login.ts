import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../models/loginRequest';
import { UserService } from '../../services/user-service';
import { jwtDecode} from 'jwt-decode';
import { EmpProfile } from '../../models/EmployeeProfileModel';
import { AuthService } from '../../services/auth-service';
import { EmployeeProfile } from '../employee-profile/employee-profile';

interface JwtPayload {
  unique_name: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})



export class Login {
  error = '';
  isLoggedIn: boolean = false;
  //employeeId: number = 0;

  loginreq: LoginRequest = {
    username: '',
    password: ''
  };

  

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.loginreq)
      .subscribe({
      next: (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);
        console.log(token);
        localStorage.setItem('role', res.role);

        // Fetch FullName after login
        this.auth.getProfile().subscribe((profile: EmpProfile) => {
          localStorage.setItem('fullname', profile.fullName);
          localStorage.setItem('employeeId', String(profile.employeeId));
          console.log(profile);
          this.router.navigate(['/dashboard']);
        });

        localStorage.setItem('username', this.loginreq.username);
        
        this.isLoggedIn = true;
        
      },
      error: () => this.error = 'Invalid Credentials'
    });
  }
}
