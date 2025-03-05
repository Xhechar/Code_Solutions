import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Problem } from '../../../../interfaces/solutions.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-problems',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-problems.component.html',
  styleUrl: './my-problems.component.css'
})
export class MyProblemsComponent {
  problems: Problem[] = [];
  filteredProblems: Problem[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // For delete modal
  showDeleteModal: boolean = false;
  problemToDelete: Problem | null = null;

  // Badge thresholds
  badgeThresholds = [
    { level: 'Bronze', count: 5 },
    { level: 'Silver', count: 15 },
    { level: 'Gold', count: 30 },
    { level: 'Platinum', count: 50 },
    { level: 'Diamond', count: 100 }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {
    // Create mock data instead of calling a service
    this.createMockData();
    this.applyFilters();
    this.calculateTotalPages();
  }

  createMockData(): void {
    // Mock data for demonstration
    const mockCategories: Category[] = [
      {
        CategoryId: '1', Name: 'JavaScript Error',
        Description: ''
      },
      {
        CategoryId: '2', Name: 'Database Issue',
        Description: ''
      },
      {
        CategoryId: '3', Name: 'API Integration',
        Description: ''
      },
      {
        CategoryId: '4', Name: 'Performance',
        Description: ''
      }
    ];

    this.problems = Array(25).fill(0).map((_, i) => {
      const approved = i % 3 === 0; // Every third problem is approved
      return {
        ProblemId: `prob-${i}-${Math.random().toString(36).substring(2, 10)}`,
        Title: `Problem ${i + 1}: ${approved ? 'Resolved Error' : 'Pending Issue'} ${i % 4 === 0 ? 'with Database' : i % 3 === 0 ? 'with API' : 'in Code'}`,
        Description: `This is a sample description for problem ${i + 1}. It explains the issue in detail.`,
        ErrorCode: i % 2 === 0 ? `ERR-${1000 + i}` : undefined,
        Tags: this.getRandomTags(i),
        Reproducibility: i % 2 === 0,
        PriorityLevel: (i % 3) + 1,
        ImagePath: i % 4 === 0 ? `/assets/problem-${(i % 3) + 1}.jpg` : undefined,
        DateCreated: new Date(2023, i % 12, (i % 28) + 1),
        StackId: `stack-${(i % 4) + 1}`,
        CategoryId: mockCategories[i % mockCategories.length].CategoryId,
        Category: mockCategories[i % mockCategories.length],
        Solutions: approved ? [{ SolutionId: `sol-${i}`, Content: 'Sample solution' }] : [],
        UserId: 'current-user-id',
        // Other properties would be added here in a real implementation
      } as unknown as Problem;
    });
  }

  getRandomTags(seed: number): string {
    const allTags = ['javascript', 'angular', 'react', 'node', 'express', 'mongodb', 'sql', 'api', 'frontend', 'backend', 'performance', 'security'];
    const numTags = (seed % 3) + 1; // 1 to 3 tags
    const selectedTags = [];
    
    for (let i = 0; i < numTags; i++) {
      selectedTags.push(allTags[(seed + i) % allTags.length]);
    }
    
    return selectedTags.join(',');
  }

  getTagsArray(tags?: string): string[] {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim());
  }

  applyFilters(): void {
    let filtered = this.problems;
    
    // Apply search term filter
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
    
    // Apply status filter
    if (this.activeFilter === 'approved') {
      filtered = filtered.filter(problem => this.isApproved(problem));
    } else if (this.activeFilter === 'pending') {
      filtered = filtered.filter(problem => !this.isApproved(problem));
    }
    
    // Calculate total pages before pagination
    const totalFilteredCount = filtered.length;
    this.totalPages = Math.ceil(totalFilteredCount / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    
    // Adjust current page if needed
    this.adjustCurrentPage();
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProblems = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  filterProblems(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.applyFilters();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterProblems();
  }

  isApproved(problem: Problem): boolean {
    // Consider a problem approved if it has at least one solution
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
    if (this.totalPages === 0) this.totalPages = 1; // Always at least one page
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
    console.log('Viewing problem:', problem.ProblemId);
    // Using router without actually navigating for demo
    // this.router.navigate(['/problem', problem.ProblemId]);
  }

  editProblem(problem: Problem): void {
    console.log('Editing problem:', problem.ProblemId);
    // Using router without actually navigating for demo
    // this.router.navigate(['/edit-problem', problem.ProblemId]);
  }

  confirmDelete(problem: Problem): void {
    this.problemToDelete = problem;
    this.showDeleteModal = true;
  }

  deleteProblem(): void {
    if (this.problemToDelete) {
      console.log('Deleting problem:', this.problemToDelete.ProblemId);
      
      // Remove the problem from the arrays directly without service call
      this.problems = this.problems.filter(p => p.ProblemId !== this.problemToDelete?.ProblemId);
      this.applyFilters();
      this.showDeleteModal = false;
      this.problemToDelete = null;
    }
  }

  // Badge-related methods
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
    
    // If they've reached the highest badge level
    return this.badgeThresholds[this.badgeThresholds.length - 1].count;
  }

  getProgressPercentage(): number {
    const approvedCount = this.getApprovedCount();
    const nextThreshold = this.getNextBadgeThreshold();
    
    // Calculate the previous threshold (or 0 if it's the first badge)
    let prevThreshold = 0;
    for (let i = 0; i < this.badgeThresholds.length; i++) {
      if (this.badgeThresholds[i].count === nextThreshold) {
        prevThreshold = i > 0 ? this.badgeThresholds[i - 1].count : 0;
        break;
      }
    }
    
    // If they've maxed out the badges
    if (approvedCount >= this.badgeThresholds[this.badgeThresholds.length - 1].count) {
      return 100;
    }
    
    // Calculate progress percentage within the current badge level
    const progress = ((approvedCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    return Math.round(progress);
  }
}
