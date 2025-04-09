import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PSG, PSGDto } from '../interfaces/solutions.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PsgService {
  private API_URL: string = 'http://localhost:3000/psg/';

  constructor(private http: HttpClient) { }

  createPsg(ProjectId: string , psg: PSGDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-psg/${ProjectId}`,
      psg,
      { withCredentials: true }
    );
  }

  updatePsg(PSGId: string, psg: PSGDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-psg/${PSGId}`,
      psg,
      { withCredentials: true }
    );
  }

  deletePsg(PSGId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-psg/${PSGId}`,
      { withCredentials: true }
    );
  }

  getPsgsByProject(ProjectId: string): Observable<{ success: boolean, error?: string, message?: string, psgs?: PSG[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, psgs?: PSG[] }>(
      `${this.API_URL}get-psg-by-project/${ProjectId}`,
      { withCredentials: true }
    );
  }
}
