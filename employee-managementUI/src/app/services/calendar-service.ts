import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HolidayDto {
  localName: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = `${environment.apiBaseUrl}/api/events`;

  constructor(private http: HttpClient) { }

  getCalendarEvents(year: number, month: number): Observable<HolidayDto[]> {
    return this.http.get<HolidayDto[]>(`${this.baseUrl}/calendar?year=${year}&month=${month}`);
  }

  getAllEvents(year: number) : Observable<HolidayDto[]> {
    return this.http.get<HolidayDto[]>(`${this.baseUrl}/allevents?year=${year}`);
  }

  getYearlyHolidays(year: number) : Observable<HolidayDto[]> {
    return this.http.get<HolidayDto[]>(`${this.baseUrl}/holidays?year=${year}`);
  }

  createCalendarEvent(event: HolidayDto) : Observable<HolidayDto> {
    return this.http.post<HolidayDto>(`${this.baseUrl}`, event);
  }

}
