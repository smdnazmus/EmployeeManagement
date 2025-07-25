import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/userModel';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/loginRequest';
import { EmpProfile } from '../models/EmployeeProfileModel';
import { environment } from '../../environments/environment.dev';
//import { UserProfile } from '../components/user-profile/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private baseUrl = 'https://localhost:7209/api';

  private baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(user: LoginRequest) : Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getUsers() : Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number) {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  updateUser(id: number, user: User) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/users/${id}`, user, { headers });
  }

  deleteUser(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  changePassword(data: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/profile/change-password`, data, {headers});
  }

  resetPasswordDirect(data: any) {
    return this.http.post(`${this.baseUrl}/auth/reset-password-direct`, data);
  }

  updateRole(data: any) {
    //const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/profile/update-role`, data);
  }

  getProfile() : Observable<EmpProfile> {
    const headers = this.getAuthHeaders();
    return this.http.get<EmpProfile>(`${this.baseUrl}/profile/profile`, { headers });
  }


}
