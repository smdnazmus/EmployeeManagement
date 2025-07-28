import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/loginRequest';
import { Observable } from 'rxjs';
import { EmployeeProfile } from '../components/employee-profile/employee-profile';
import { EmpProfile } from '../models/EmployeeProfileModel';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private baseUrl = 'https://localhost:7209/api/auth';
  private baseUrl = `${environment.apiBaseUrl}/api/auth`;
  // Checks if token exists in localstorage
  get isAuthenticatd() : boolean {
    return !!localStorage.getItem('token');
  }

  get role() : string | null {
    return localStorage.getItem('role');
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  constructor(private http: HttpClient, private router: Router) { }

  login(user: LoginRequest) : Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    });
  }

  logout() : void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  getProfile() : Observable<EmpProfile> {
      const headers = this.getAuthHeaders();
      return this.http.get<EmpProfile>(`${this.baseUrl}/profile`, { headers });
  }

  resetPasswordDirect(data: any) {
    return this.http.post(`${this.baseUrl}/reset-password-direct`, data);
  }

  updateRole(data: any) {
    //const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/update-role`, data);
  }

  changeEmpPassword(data: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/change-emp-password`, data, {headers});
  }
}
