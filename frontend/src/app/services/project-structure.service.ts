import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectStructure, ProjectStructureDto } from '../interfaces/solutions.interfaces';
import { SharedService } from './modifiers/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStructureService {
  // API_URL: string = 'http://localhost:3000/p_structure/';
  API_URL: string = `${SharedService.API_URL}p_structure/`;

  constructor(private http: HttpClient) { }

  createProjectStructure(projectStructure: ProjectStructureDto): Observable<{ success: boolean, error?: string, message?: string; project?: ProjectStructure  }> {
    return this.http.post<{ success: boolean, error?: string, message?: string; project?: ProjectStructure  }>(
      `${this.API_URL}create-project-structure`,
      projectStructure,
      { withCredentials: true }
    );
  }

  updateProjectStructure(ProjectId: string, projectStructure: ProjectStructureDto): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.put<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}update-project-structure/${ProjectId}`,
      projectStructure,
      { withCredentials: true }
    );
  }

  deleteProjectStructure(ProjectId: string): Observable<{ success: boolean, error?: string, message?: string }> {
    return this.http.delete<{ success: boolean, error?: string, message?: string }>(
      `${this.API_URL}delete-project-structure/${ProjectId}`,
      { withCredentials: true }
    );
  }

  getAllProjectStructures(): Observable<{ success: boolean, error?: string, message?: string, projects?: ProjectStructure[] }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, projects?: ProjectStructure[] }>(
      `${this.API_URL}get-all-project-structures`,
      { withCredentials: true }
    );
  }

  getSingleProjectStructure(ProjectId: string): Observable<{ success: boolean, error?: string, message?: string, project?: ProjectStructure }> {
    return this.http.get<{ success: boolean, error?: string, message?: string, project?: ProjectStructure }>(
      `${this.API_URL}get-single-project-structure/${ProjectId}`,
      { withCredentials: true }
    );
  }
}
