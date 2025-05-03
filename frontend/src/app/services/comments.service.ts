import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  // API_URL: string = 'http://localhost:3000/comment/';
  API_URL: string = `${SharedService.API_URL}comment/`;

  
  constructor(private http: HttpClient) { }
  
  createComment(ProblemId: string, Content: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}create-comment/${ProblemId}`,
      {Content}, 
      { withCredentials: true }
    );
  }
  
  updateComment(CommentId: string, comment: Comment): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.post<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-comment/${CommentId}`, 
      comment, 
      { withCredentials: true }
    );
  }
  
  deleteComment(CommentId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-comment/${CommentId}`, 
      { withCredentials: true }
    );
  }
  
  getCommentsByProblem(ProblemId: string): Observable<{ success: boolean, error?: string, message?: string, comments?: Comment[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, comments?: Comment[] }>(
      `${this.API_URL}get-comment-by-problem/${ProblemId}`, 
      { withCredentials: true }
    );
  }
}
