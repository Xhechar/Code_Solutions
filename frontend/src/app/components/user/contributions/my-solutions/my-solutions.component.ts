import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Solution, Problem, SuccessType, UpdatePS } from '../../../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../../../services/modifiers/notifications.service'; 
import { ProblemService } from '../../../../services/problem.service';
import { ModalService } from '../../../../services/modifiers/modal.service';

@Component({
  selector: 'app-my-solutions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-solutions.component.html',
  styleUrl: './my-solutions.component.css'
})
export class MySolutionsComponent implements OnInit {
  solutions: Solution[] = [];
  filteredSolutions: Solution[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // For delete modal
  showDeleteModal: boolean = false;
  problemToDelete: Problem | null = null;

  constructor(
    private router: Router,
    private solutionService: ProblemService,
    private notificationsService: NotificationsService,
    private ms: ModalService
  ) {}

  ngOnInit(): void {
    this.loadSolutions();
  }

  loadSolutions(): void {
    this.solutionService.getUserProblems().subscribe({
      next: (response) => {
        if (response.success) {
          this.solutions = (response.problems as Problem[]).reduce((acc: Solution[], problem: Problem) => {
            const solutions = problem.Solutions || [];
            return acc.concat(solutions.map((solution: Solution) => ({ ...solution, Problem: problem })));
          }, []);
          this.applyFilters();
          this.calculateTotalPages();
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error?.error || 'Failed to fetch solutions');
      }
    });
  }

  filterSolutions(): void {
    this.applyFilters();
    this.currentPage = 1; // Reset to first page on filter change
    this.calculateTotalPages();
  }

  applyFilters(): void {
    let filtered = this.solutions.filter(solution => {
      const searchString = this.searchTerm.toLowerCase();
      return (
        solution.Description.toLowerCase().includes(searchString) ||
        (solution.Problem?.Title || '').toLowerCase().includes(searchString) ||
        (solution.Steps || '').toLowerCase().includes(searchString) ||
        (solution.Problem?.Category?.Name || '').toLowerCase().includes(searchString)
      );
    });

    if (this.activeFilter === 'approved') {
      filtered = filtered.filter(solution => this.isApproved(solution));
    } else if (this.activeFilter === 'pending') {
      filtered = filtered.filter(solution => !this.isApproved(solution));
    }

    this.filteredSolutions = filtered;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredSolutions.length / this.itemsPerPage));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getCurrentPageItems(): Solution[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredSolutions.length);
    return this.filteredSolutions.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterSolutions();
  }

  isApproved(solution: Solution): boolean {
    return solution.Problem?.IsApproved || false;
  }

  getApprovedCount(): number {
    return this.solutions.filter(solution => this.isApproved(solution)).length;
  }

  getHelpfulnessRating(): string {
    const approvedSolutions = this.solutions.filter(solution => this.isApproved(solution));
    if (approvedSolutions.length === 0) return '0.0';

    const totalRating = approvedSolutions.reduce((sum, solution) => {
      return sum + (solution.Problem?.Favourites?.length || 0);
    }, 0);

    return (totalRating / approvedSolutions.length).toFixed(1);
  }

  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  viewSolution(problem: Problem | undefined): void {
    if (!problem) return;
    this.router.navigate(['/user/single-problem', problem.ProblemId]);
  }

  editSolution(solution: Solution, problem: Problem | undefined): void {
    if (!problem) return;
    let probSol: UpdatePS = ({
      ProblemUpdate: problem,
      SolutionUpdate: solution
    });
    this.ms.setUpdateProbSol(probSol);
    this.router.navigate(['/user/create-solution']);
  }

  viewRelatedProblem(problem: Problem | undefined): void {
    if (!problem) return;
    this.router.navigate(['/user/single-problem', problem.ProblemId]);
  }

  confirmDelete(problem: Problem): void {
    this.problemToDelete = problem;
    this.showDeleteModal = true;
  }

  deleteSolution(): void {
    if (!this.problemToDelete) return;

    this.solutionService.deleteProblem(this.problemToDelete.ProblemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.solutions = this.solutions.filter(solution => solution.ProblemId !== this.problemToDelete?.ProblemId);
          this.filteredSolutions = this.filteredSolutions.filter(solution => solution.ProblemId !== this.problemToDelete?.ProblemId);
          this.applyFilters();
          this.calculateTotalPages();
          this.showDeleteModal = false;
          this.problemToDelete = null;
          this.notificationsService.showAlert(SuccessType.Success, 'Solution deleted successfully!');
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
          this.showDeleteModal = false;
          this.problemToDelete = null;
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error?.error || 'Failed to delete solution');
        this.showDeleteModal = false;
        this.problemToDelete = null;
      }
    });
  }
}