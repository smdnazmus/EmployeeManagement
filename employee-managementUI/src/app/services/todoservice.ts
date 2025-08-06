import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class Todoservice {

  private baseUrl = `${environment.apiBaseUrl}/api/todo`;

  constructor(private http: HttpClient) { }

  getTaskByDate(date: Date) : Observable<ToDo[]> {
    const isoDate = date.toISOString();
    return this.http.get<ToDo[]>(`${this.baseUrl}/by-date?date=${isoDate}`);
  }

  createTask(task: ToDo) : Observable<ToDo> {
    return this.http.post<ToDo>(`${this.baseUrl}`, task);
  }
}
