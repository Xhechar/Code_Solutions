import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solution, SolutionDto } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  // private API_URL: string = 'http://localhost:3000/solution/';
  API_URL: string = `${SharedService.API_URL}solution/`;

  constructor(private http: HttpClient) { }

  createSolution(ProblemId: string, solution: SolutionDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-solution/${ProblemId}`,
      solution,
      { withCredentials: true }
    );
  }

  updateSolution(SolutionId: string, solution: SolutionDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-solution/${SolutionId}`,
      solution,
      { withCredentials: true }
    );
  }

  deleteSolution(SolutionId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-solution/${SolutionId}`,
      { withCredentials: true }
    );
  }

  getAllSolutions(): Observable<{ success: boolean, error?: string, message?: string, solutions?: Solution[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, solutions?: Solution[] }>(
      `${this.API_URL}get-all-solutions`,
      { withCredentials: true }
    );
  }

  getSolutionsByProblem(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string, solutions?: Solution[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, solutions?: Solution[] }>(
      `${this.API_URL}get-solution-by-problem/${ProblemId}`,
      { withCredentials: true }
    );
  }
}
