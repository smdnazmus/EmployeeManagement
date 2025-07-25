import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyIncome } from '../models/incomeModel';
import { CompanyExpense } from '../models/expenseModel';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  //private baseUrl = 'https://localhost:7209/api/finance';

  private baseUrl = `${environment.apiBaseUrl}/api/finance`;

  constructor(private http: HttpClient) { }

  // Income Servives
  getAllIncome() : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/income`);
  }

  getIncomeById(id: number) : Observable<CompanyIncome> {
    return this.http.get<CompanyIncome>(`${this.baseUrl}/income/${id}`);
  } 

  getIncomeListMonthly(year: number, month: number) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/income/${year}/${month}`);
  }

  createIncome(income: CompanyIncome) : Observable<CompanyIncome> {
    return this.http.post<CompanyIncome>(`${this.baseUrl}/create-income`, income);
  }

  updateIncome(id: number, income: any) : Observable<CompanyIncome> {
    return this.http.put<CompanyIncome>(`${this.baseUrl}/update-income/${id}`, income);
  }

  deleteIncome(id: number) : Observable<CompanyIncome> {
    return this.http.delete<CompanyIncome>(`${this.baseUrl}/delete-income/${id}`);
  }


  // Expense Services
  getAllExpenses() : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/expense`);
  }

  getExpenseById(id: number) : Observable<CompanyExpense> {
    return this.http.get<CompanyExpense>(`${this.baseUrl}/expense/${id}`);
  } 

  getExpenseListMonthly(year: number, month: number) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/expense/${year}/${month}`);
  }

  createExpense(expense: CompanyExpense) : Observable<CompanyExpense> {
    return this.http.post<CompanyExpense>(`${this.baseUrl}/create-expense`, expense);
  }

  updateExpense(id: number, expense: any) : Observable<CompanyExpense> {
    return this.http.put<CompanyExpense>(`${this.baseUrl}/update-expense/${id}`, expense);
  }

  deleteExpense(id: number) : Observable<CompanyExpense> {
    return this.http.delete<CompanyExpense>(`${this.baseUrl}/delete-expense/${id}`);
  }

  // Summary
  getSummary(year: number, month: number) : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary-monthly/${year}/${month}`);
  }

  downloadReport(year: number, month: number) : Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report/pdf?year=${year}&month=${month}`, { responseType: 'blob' });
  }

  downloadYearlyReport(year: number) : Observable<Blob> {
    return this.http.get(`${this.baseUrl}/yearly-report?year=${year}`, { responseType: 'blob'})
  }
}
