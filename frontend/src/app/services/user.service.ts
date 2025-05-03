import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private API_URL: string = 'http://localhost:3000/user/';
  API_URL: string = `${SharedService.API_URL}user/`;

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-user`,
      user,
      { withCredentials: true }
    );
  }

  updateUser(user: Partial<User>): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-user`,
      user,
      { withCredentials: true }
    );
  }

  updateProfileImage(ProfilePhoto: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-profile-image`,
      { ProfilePhoto },
      { withCredentials: true }
    );
  }

  softDeleteUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}soft-delete-user/${UserId}`,
      null,
      { withCredentials: true }
    );
  }

  deleteUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-user/${UserId}`,
      { withCredentials: true }
    );
  }

  restoreUser(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}restore-user/${UserId}`,
      null,
      { withCredentials: true }
    );
  }

  updateUserRole(UserId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-user-role/${UserId}`,
      { withCredentials: true }
    );
  }

  getSingleUser(): Observable<{ success: boolean, error?: string, message?: string, user?: User }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, user?: User }>(
      `${this.API_URL}get-single-user`,
      { withCredentials: true }
    );
  }

  getAllUsers(): Observable<{ success: boolean, error?: string, message?: string, users?: User[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, users?: User[] }>(
      `${this.API_URL}get-all-users`,
      { withCredentials: true }
    );
  }

  getSoftDeletedUsers(): Observable<{ success: boolean, error?: string, message?: string, users?: User[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, users?: User[] }>(
      `${this.API_URL}get-soft-deleted-users`,
      { withCredentials: true }
    );
  }

  bulkDeleteUsers(userIds: string[]): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}bulk-delete-users`,
      { userIds },
      { withCredentials: true }
    );
  }
}
