import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Problem, ProblemDto } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  // API_URL: string = 'http://localhost:3000/problem/';
  API_URL: string = `${SharedService.API_URL}problem/`;
  
  constructor(private http: HttpClient) { }
  
  createProblem(problem: ProblemDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-problem`,
      problem, 
      { withCredentials: true }
    );
  }
  
  updateProblem(ProblemId: string, problem: ProblemDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-problem/${ProblemId}`, 
      problem, 
      { withCredentials: true }
    );
  }
  
  approveProblem(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}approve-problem/${ProblemId}`, 
      {}, 
      { withCredentials: true }
    );
  }
  
  deleteProblem(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-problem/${ProblemId}`, 
      { withCredentials: true }
    );
  }
  
  getUserProblems(): Observable<{ success: boolean, error?: string, message?: string, problems?: Problem[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, problems?: Problem[] }>(
      `${this.API_URL}get-user-problems`, 
      { withCredentials: true }
    );
  }
  
  getAllProblems(): Observable<{ success: boolean, error?: string, message?: string, problems?: Problem[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, problems?: Problem[] }>(
      `${this.API_URL}get-all-problems`, 
      { withCredentials: true }
    );
  }
  
  getAdminProblems(): Observable<{ success: boolean, error?: string, message?: string, problems?: Problem[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, problems?: Problem[] }>(
      `${this.API_URL}get-admin-problems`, 
      { withCredentials: true }
    );
  }
  
  getApprovedProblems(): Observable<{ success: boolean, error?: string, message?: string, problems?: Problem[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, problems?: Problem[] }>(
      `${this.API_URL}get-approved-problems`, 
      { withCredentials: true }
    );
  }
  
  getSingleProblem(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string, problem?: Problem }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, problem?: Problem }>(
      `${this.API_URL}get-single-problem/${ProblemId}`, 
      { withCredentials: true }
    );
  }
}
