import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveReq } from '../models/leaveReqModel';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

   //private baseUrl = 'https://localhost:7209/api/finance';
  
  private baseUrl = `${environment.apiBaseUrl}/api/employeeleave`;

  private pendingCoundSubject = new BehaviorSubject<number>(0);
  pendingCount$ = this.pendingCoundSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchLeaveRequests(): Observable<LeaveReq[]> {
    return this.http.get<LeaveReq[]>(`${this.baseUrl}`);
  }

  updatePendingCount() {
    this.fetchLeaveRequests().subscribe({
      next: leaves => {
        const pendingCount = leaves.filter(l => l.status === 'Pending').length;
        this.pendingCoundSubject.next(pendingCount);
      }
    });
  }

  submitLeave(leaveReq: LeaveReq) : Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/submit`, leaveReq, { headers });
  }

  getLeavesForEmployee(empId: number) : Observable<LeaveReq[]> {
    return this.http.get<LeaveReq[]>(`${this.baseUrl}/employee/${empId}`);
  }

  approveLeave(id: number) : Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectLeave(id: number) : Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reject`, {});
  }

  getAllLeaves() : Observable<LeaveReq[]> {
    return this.http.get<LeaveReq[]>(`${this.baseUrl}`);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  
}
