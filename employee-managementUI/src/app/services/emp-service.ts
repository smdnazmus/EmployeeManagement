import { Injectable } from '@angular/core';
import { Employee } from '../models/employeeModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  //private baseUrl = 'https://localhost:7209/api';

  private baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  getEmps(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }

  getEmp(id: number) : Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  getEmpByEmpId(empId: number) : Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/by-employeeid/${empId}`);
  }

  createEmp(emp: Employee) : Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/auth/create-employee`, emp);
  }

  updateEmp(id: number,emp: Employee) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/employees/${id}`, emp, { headers });
  }

  deleteEmp(id: number) {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }

  uploadPhoto(id: number, data: any) {
    return this.http.post(`${this.baseUrl}/employees/upload-photo/${id}`, data);
  }

  checkUniqueEmpId(id: number) : Observable<boolean> {
    return this.http.get<{exists: boolean}>(`${this.baseUrl}/auth/CheckEmployeeId/${id}`)
                    .pipe(map(response => !response.exists));
  }
/*
  changeEmpPassword(data: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/change-emp-password`, data, {headers});
  }
*/
  uploadCSV(data: any) {
    return this.http.post<Employee>(`${this.baseUrl}/employees/upload-csv`, data);
  }

  uploadNID(id: number, formData: FormData) : Observable<any> {
    return this.http.post(`${this.baseUrl}/employees/upload-nid/${id}`, formData);
  }


   private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  


}
