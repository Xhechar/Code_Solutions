import { Component, OnInit } from '@angular/core';
import { Category, Problem, Solution, Stack, SuccessType, UpdatePS, User } from '../../../../interfaces/solutions.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../../../../services/modifiers/notifications.service';
import { ProblemService } from '../../../../services/problem.service';
import { SolutionService } from '../../../../services/solution.service';
import { NotificationsComponent } from "../../../notifications/notifications.component";
import { ModalService } from '../../../../services/modifiers/modal.service';

@Component({
  selector: 'app-admin-problems',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationsComponent],
  templateUrl: './admin-problems.component.html',
  styleUrl: './admin-problems.component.css'
})
export class AdminProblemsComponent implements OnInit {
  problems: Problem[] = [];
  filteredProblems: Problem[] = [];
  currentFilter: string = 'all';
  searchQuery: string = '';
  
  // Stats
  totalProblems: number = 0;
  approvedProblems: number = 0;
  pendingProblems: number = 0;
  userProblems: number = 0;
  adminProblems: number = 0;

  // Expansion state
  expandedProblems: Map<string, boolean> = new Map();

  constructor(
    private problemService: ProblemService,
    private ns: NotificationsService,
    private sos: SolutionService,
    private ms: ModalService
  ) { }

  ngOnInit(): void {
    this.fetchProblems();
  }

  private fetchProblems(): void {
    this.problemService.getAllProblems().subscribe({
      next: (response) => {
        if (response.success && response.problems) {
          this.problems = response.problems as Problem[];
          this.calculateStats();
          this.filterProblems('all');
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  calculateStats(): void {
    this.totalProblems = this.problems.length;
    this.approvedProblems = this.problems.filter(p => p.IsApproved).length;
    this.pendingProblems = this.problems.filter(p => !p.IsApproved).length;
    this.userProblems = this.problems.filter(p => p.User?.Role === 'user').length;
    this.adminProblems = this.problems.filter(p => p.User?.Role === 'admin').length;
  }

  filterProblems(filter: string): void {
    this.currentFilter = filter;

    switch (filter) {
      case 'user':
        this.filteredProblems = this.problems.filter(p => p.User?.Role === 'user');
        break;
      case 'admin':
        this.filteredProblems = this.problems.filter(p => p.User?.Role === 'admin');
        break;
      case 'approved':
        this.filteredProblems = this.problems.filter(p => p.IsApproved);
        break;
      case 'pending':
        this.filteredProblems = this.problems.filter(p => !p.IsApproved);
        break;
      case 'all':
      default:
        this.filteredProblems = [...this.problems];
        break;
    }

    if (this.searchQuery.trim() !== '') {
      this.searchProblems();
    }
  }

  searchProblems(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (query === '') {
      this.filterProblems(this.currentFilter);
      return;
    }

    let baseProblems: Problem[];
    switch (this.currentFilter) {
      case 'user':
        baseProblems = this.problems.filter(p => p.User?.Role === 'user');
        break;
      case 'admin':
        baseProblems = this.problems.filter(p => p.User?.Role === 'admin');
        break;
      case 'approved':
        baseProblems = this.problems.filter(p => p.IsApproved);
        break;
      case 'pending':
        baseProblems = this.problems.filter(p => !p.IsApproved);
        break;
      case 'all':
      default:
        baseProblems = [...this.problems];
        break;
    }

    this.filteredProblems = baseProblems.filter(p => 
      p.Title.toLowerCase().includes(query) ||
      p.Description.toLowerCase().includes(query) ||
      (p.ErrorCode && p.ErrorCode.toLowerCase().includes(query)) ||
      (p.Tags && p.Tags.toLowerCase().includes(query)) ||
      (p.Environment && p.Environment.toLowerCase().includes(query)) ||
      (p.Stack?.Name.toLowerCase().includes(query)) ||
      (p.Category?.Name.toLowerCase().includes(query))
    );
  }

  toggleProblem(problem: Problem): void {
    const current = this.expandedProblems.get(problem.ProblemId) || false;
    this.expandedProblems.set(problem.ProblemId, !current);
  }

  isExpanded(id: string): boolean {
    return this.expandedProblems.get(id) || false;
  }

  approveProblem(problem: Problem, event: MouseEvent): void {
    event.stopPropagation();
    this.problemService.approveProblem(problem.ProblemId).subscribe({
      next: (response) => {
        if (response.success) {
          problem.IsApproved = true;
          this.calculateStats();
          this.filterProblems(this.currentFilter);
          this.ns.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  deleteProblem(problem: Problem, event: MouseEvent): void {
    event.stopPropagation();
    this.problemService.deleteProblem(problem.ProblemId).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.problems.findIndex(p => p.ProblemId === problem.ProblemId);
          if (index !== -1) {
            this.problems.splice(index, 1);
            this.calculateStats();
            this.filterProblems(this.currentFilter);
            this.ns.showAlert(SuccessType.Success, response.message as string);
          }
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  toggleSolutionEdit(updatePS: UpdatePS): void {
    this.ms.setUpdateProbSol(updatePS);
  }

  updateSolution(solution: Solution, problem: Problem): void {
    this.sos.updateSolution(solution.SolutionId, solution).subscribe({
      next: (response) => {
        if (response.success) {
          solution.UpdatedAt = new Date();
          this.ns.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  deleteSolution(solution: Solution, problem: Problem): void {
    this.sos.deleteSolution(solution.SolutionId).subscribe({
      next: (response) => {
        if (response.success) {
          const index = problem.Solutions?.findIndex(s => s.SolutionId === solution.SolutionId) ?? -1;
          if (index !== -1 && problem.Solutions) {
            problem.Solutions.splice(index, 1);
            this.ns.showAlert(SuccessType.Success, response.message as string);
          }
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  removeImage(solution: Solution, problem: Problem): void {
    //
  }

  getPriorityLabel(priority: number): string {
    switch(priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Unknown';
    }
  }

  setData(problem: Problem): void {
    this.ms.setUpdateProblemData(problem);
  }

  setUpdatedProblem(problem: Problem): void {
    this.ms.setSolvedProblemData(problem);
  }
}