import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Problem } from '../../../../interfaces/solutions.interfaces';
import { Router } from '@angular/router';
import { ProblemService } from '../../../../services/problem.service';

@Component({
  selector: 'app-my-problems',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-problems.component.html',
  styleUrl: './my-problems.component.css'
})
export class MyProblemsComponent implements OnInit {
  problems: Problem[] = [];
  filteredProblems: Problem[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  showDeleteModal: boolean = false;
  problemToDelete: Problem | null = null;

  badgeThresholds = [
    { level: 'Bronze', count: 5 },
    { level: 'Silver', count: 15 },
    { level: 'Gold', count: 30 },
    { level: 'Platinum', count: 50 },
    { level: 'Diamond', count: 100 }
  ];

  constructor(
    private router: Router,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {
    this.problemService.getUserProblems().subscribe({
      next: (response) => {
        if (response.success) {
          this.problems = response.problems as Problem[];
          this.applyFilters();
          this.calculateTotalPages();
        } else {
          console.error('Failed to load problems:', response.error);
        }
      },
      error: (error) => {
        console.error('Error fetching problems:', error);
      }
    });
  }

  getTagsArray(tags?: string): string[] {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim());
  }

  applyFilters(): void {
    let filtered = this.problems;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(problem =>
        problem.Title.toLowerCase().includes(term) ||
        problem.Description.toLowerCase().includes(term) ||
        (problem.ErrorCode && problem.ErrorCode.toLowerCase().includes(term)) ||
        (problem.Category?.Name && problem.Category.Name.toLowerCase().includes(term)) ||
        (problem.Tags && problem.Tags.toLowerCase().includes(term))
      );
    }

    if (this.activeFilter === 'approved') {
      filtered = filtered.filter(problem => this.isApproved(problem));
    } else if (this.activeFilter === 'pending') {
      filtered = filtered.filter(problem => !this.isApproved(problem));
    }

    const totalFilteredCount = filtered.length;
    this.totalPages = Math.ceil(totalFilteredCount / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;

    this.adjustCurrentPage();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProblems = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  filterProblems(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterProblems();
  }

  isApproved(problem: Problem): boolean {
    return problem.Solutions !== undefined && problem.Solutions.length > 0;
  }

  calculateTotalPages(): void {
    const totalItems = this.problems.filter(problem => {
      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'approved') return this.isApproved(problem);
      if (this.activeFilter === 'pending') return !this.isApproved(problem);
      return true;
    }).length;

    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  adjustCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  viewProblem(problem: Problem): void {
    this.router.navigate(['/problem', problem.ProblemId]);
  }

  editProblem(problem: Problem): void {
    this.router.navigate(['/edit-problem', problem.ProblemId]);
  }

  confirmDelete(problem: Problem): void {
    this.problemToDelete = problem;
    this.showDeleteModal = true;
  }

  deleteProblem(): void {
    if (this.problemToDelete) {
      this.problemService.deleteProblem(this.problemToDelete.ProblemId).subscribe({
        next: (response) => {
          if (response.success) {
            this.problems = this.problems.filter(p => p.ProblemId !== this.problemToDelete?.ProblemId);
            this.applyFilters();
            this.showDeleteModal = false;
            this.problemToDelete = null;
            console.log('Problem deleted successfully');
          } else {
            console.error('Failed to delete problem:', response.error);
          }
        },
        error: (error) => {
          console.error('Error deleting problem:', error);
        }
      });
    }
  }

  getApprovedCount(): number {
    return this.problems.filter(problem => this.isApproved(problem)).length;
  }

  getBadgeLevel(): string {
    const approvedCount = this.getApprovedCount();
    let currentBadge = this.badgeThresholds[0].level;

    for (let i = this.badgeThresholds.length - 1; i >= 0; i--) {
      if (approvedCount >= this.badgeThresholds[i].count) {
        currentBadge = this.badgeThresholds[i].level;
        break;
      }
    }

    return currentBadge;
  }

  getNextBadgeThreshold(): number {
    const approvedCount = this.getApprovedCount();

    for (const threshold of this.badgeThresholds) {
      if (approvedCount < threshold.count) {
        return threshold.count;
      }
    }

    return this.badgeThresholds[this.badgeThresholds.length - 1].count;
  }

  getProgressPercentage(): number {
    const approvedCount = this.getApprovedCount();
    const nextThreshold = this.getNextBadgeThreshold();

    let prevThreshold = 0;
    for (let i = 0; i < this.badgeThresholds.length; i++) {
      if (this.badgeThresholds[i].count === nextThreshold) {
        prevThreshold = i > 0 ? this.badgeThresholds[i - 1].count : 0;
        break;
      }
    }

    if (approvedCount >= this.badgeThresholds[this.badgeThresholds.length - 1].count) {
      return 100;
    }

    const progress = ((approvedCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    return Math.round(progress);
  }
}