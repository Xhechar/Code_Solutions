import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // API_URL: string = 'http://localhost:3000/category/';
  API_URL: string = `${SharedService.API_URL}category/`;
  
  constructor(private http: HttpClient) { }
  
  createCategory(category: Category): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-category`,
      category, 
      { withCredentials: true }
    );
  }
  
  updateCategory(CategoryId: string, category: Category): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-category/${CategoryId}`, 
      category, 
      { withCredentials: true }
    );
  }
  
  deleteCategory(CategoryId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-category/${CategoryId}`, 
      { withCredentials: true }
    );
  }
  
  getSingleCategory(CategoryId: string): Observable<{ success: boolean, error?: string, message?: string, category?: Category }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, category?: Category }>(
      `${this.API_URL}get-single-category/${CategoryId}`, 
      { withCredentials: true }
    );
  }
  
  getAllCategories(): Observable<{ success: boolean, error?: string, message?: string, categories?: Category[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, categories?: Category[] }>(
      `${this.API_URL}get-all-categories`, 
      { withCredentials: true }
    );
  }
}
