import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stack, StackDto } from '../interfaces/solutions.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StackService {
  API_URL: string = 'http://localhost:3000/stack/';

  constructor(private http: HttpClient) { }

  createStack(stack: StackDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-stack`,
      stack,
      { withCredentials: true }
    );
  }

  updateStack(StackId: string, stack: StackDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-stack/${StackId}`,
      stack,
      { withCredentials: true }
    );
  }

  deleteStack(StackId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-stack/${StackId}`,
      { withCredentials: true }
    );
  }

  getSingleStack(StackId: string): Observable<{ success: boolean, error?: string, message?: string, stack?: Stack }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, stack?: Stack }>(
      `${this.API_URL}get-single-stack/${StackId}`,
      { withCredentials: true }
    );
  }

  getAllStacks(): Observable<{ success: boolean, error?: string, message?: string, stacks?: Stack[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, stacks?: Stack[] }>(
      `${this.API_URL}get-all-stacks`,
      { withCredentials: true }
    );
  }
}
