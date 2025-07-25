import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PayrollRecord } from '../models/payrollModel';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

 // private baseUrl = 'https://localhost:7209/api/payroll';

 private baseUrl = `${environment.apiBaseUrl}/api/payroll`;

  constructor(private http: HttpClient) { }

  getAll() : Observable<PayrollRecord[]> {
    return this.http.get<PayrollRecord[]>(`${this.baseUrl}`);
  }

  getByEmployee(id: number) :  Observable<PayrollRecord[]> {
    return this.http.get<PayrollRecord[]>(`${this.baseUrl}/${id}`);
  }

  createPayroll(record: any) : Observable<PayrollRecord> {
    return this.http.post<PayrollRecord>(`${this.baseUrl}`, record);
  } 

  updatePayroll(id: number, record: any) : Observable<PayrollRecord> {
    return this.http.put<PayrollRecord>(`${this.baseUrl}/${id}`, record);
  }

  deletePayroll(id: number) : Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  generateCurrentMonthlyPayroll(record: PayrollRecord, payload: any) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-currentMonthly`, payload);
  }

  generateMonthlyPayroll(record: PayrollRecord, payload: any) : Observable<any> {
    //const formatted = new Date().toISOString();
    return this.http.post<any>(`${this.baseUrl}/generate-Monthly`, payload);
  }

  downloadPayslipArchive(month: string) : Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-zip/${month}`, { responseType: 'blob' });
  }

  downloadPayslipByEmp(id: number, year: string, month: string) : Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/download-payslip/${id}/${year}/${month}`, {headers, responseType: 'blob'});
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
