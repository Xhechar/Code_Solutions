import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  API_URL: string = 'http://localhost:3000/history/';
  
  constructor(private http: HttpClient) { }
  
  addHistory(history: History): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}add-history`,
      history, 
      { withCredentials: true }
    );
  }
  
  getHistoryByUser(): Observable<{ success: boolean, error?: string, message?: string, histories?: History[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, histories?: History[] }>(
      `${this.API_URL}get-history-by-user`, 
      { withCredentials: true }
    );
  }
  
  clearHistory(): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}clear-history`, 
      { withCredentials: true }
    );
  }
}
