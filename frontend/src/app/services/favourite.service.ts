import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favourite } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  // API_URL: string = 'http://localhost:3000/favourite/';
    API_URL: string = `${SharedService.API_URL}favourite/`;
  
  constructor(private http: HttpClient) { }
  
  addFavourite(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}add-favourite/${ProblemId}`,
      {}, 
      { withCredentials: true }
    );
  }
  
  removeFavourite(FavouriteId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}remove-favourite/${FavouriteId}`, 
      { withCredentials: true }
    );
  }
  
  getFavouritesByUser(): Observable<{ success: boolean, error?: string, message?: string, favourites?: Favourite[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, favourites?: Favourite[] }>(
      `${this.API_URL}get-user-favourites`, 
      { withCredentials: true }
    );
  }
}
