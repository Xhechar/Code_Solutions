import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from '../interfaces/solutions.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  API_URL: string = 'http://localhost:3000/history/';
  
  constructor(private http: HttpClient) { }
  
  addHistory(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}add-history/${ProblemId}`,
      {}, 
      { withCredentials: true }
    );
  }

  deleteSingleHistory(HistoryId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-single-history/${HistoryId}`, 
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
