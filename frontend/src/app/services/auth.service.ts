import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDetails, RecoveryDetails } from '../interfaces/solutions.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL: string = 'http://localhost:3000/auth/';

  constructor(private http: HttpClient) { }

  login(loginDetails: LoginDetails): Observable<{ success: boolean, error?: string, message?: string, role?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string, role?: string }>(
      `${this.API_URL}login`,
      loginDetails,
      { withCredentials: true }
    );
  }

  logout(): Observable<{ success: boolean, message?: string }> {
    return this.http.post<{ success: boolean, message?: string }>(
      `${this.API_URL}logout`,
      {},
      { withCredentials: true }
    );
  }

  changePassword(passwordDetails: RecoveryDetails): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}change-password`,
      passwordDetails,
      { withCredentials: true }
    );
  }

  getAllRecoveries(): Observable<{ success: boolean, error?: string, message?: string, recoveries?: RecoveryDetails[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, recoveries?: RecoveryDetails[] }>(
      `${this.API_URL}recoveries`,
      { withCredentials: true }
    );
  }

  verifyEmail(Email: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}verify-email`,
      {Email},
      { withCredentials: true }
    );
  }
}
