import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Problem, SuccessType, Stack, Category } from '../../../interfaces/solutions.interfaces';
import { ProblemService } from '../../../services/problem.service';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { NotificationsService } from '../../../services/modifiers/notifications.service';
import { FavouriteService } from '../../../services/favourite.service';
import { Router } from '@angular/router';
import { HistoryService } from '../../../services/history.service';
import { StackService } from '../../../services/stack.service';
import { CategoryService } from '../../../services/category.service';

interface FilterOptions {
  searchQuery: string;
  stack: string;
  category: string;
  tags: string;
  sortBy: string;
  reproducible: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  problems: Problem[] = [];
  filteredProblems: Problem[] = [];
  testCount: number = 0;
  currentImageIndex: { [key: string]: number } = {};
  isLoading: boolean = true;
  errorSearchQuery: string = '';
  filtersVisible: boolean = true;
  stacks: Stack[] = [];
  categories: Category[] = [];

  filters: FilterOptions = {
    searchQuery: '',
    stack: '',
    category: '',
    tags: '',
    sortBy: 'newest',
    reproducible: ''
  };

  constructor(
    private problemService: ProblemService, 
    private ns: NotificationsService, 
    private fs: FavouriteService, 
    private router: Router,
    private hs: HistoryService,
    private ss: StackService,
    private cs: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchProblems();
    this.fetchStacks();
    this.fetchCategories();
    this.testCount = this.generateTestCount();
  }

  fetchProblems(): void {
    this.isLoading = true;
    this.problemService.getApprovedProblems().subscribe({
      next: (response) => {
        if (response.success) {
          this.problems = response.problems as Problem[];
          this.filteredProblems = [...this.problems];
          this.initializeImageIndices();
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
        this.isLoading = false;
      }
    });
  }

  fetchStacks(): void {
    this.ss.getAllStacks().subscribe({
      next: (response) => {
        if (response.success) {
          this.stacks = response.stacks as Stack[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  fetchCategories(): void {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories as Category[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  initializeImageIndices(): void {
    this.problems.forEach(problem => {
      if (problem.ImagePath) {
        this.currentImageIndex[problem.ProblemId] = 0;
      }
    });
  }

  generateTestCount(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  switchImage(problem: Problem, direction: 'left' | 'right'): void {
    if (!problem.ImagePath) return;
    const images = problem.ImagePath.split(', ');
    if (images.length <= 1) return;
    
    const currentIndex = this.currentImageIndex[problem.ProblemId];
    const totalImages = images.length;
    
    if (direction === 'left') {
      this.currentImageIndex[problem.ProblemId] = 
         (currentIndex - 1 + totalImages) % totalImages;
    } else {
      this.currentImageIndex[problem.ProblemId] = 
         (currentIndex + 1) % totalImages;
    }
  }

  getCurrentImage(problem: Problem): string {
    if (!problem.ImagePath) return '';
    const images = problem.ImagePath.split(', ');
    return images[this.currentImageIndex[problem.ProblemId]] || '';
  }

  addToFavourites(problemId: string): void {
    this.fs.addFavourite(problemId).subscribe({
      next: (response) => {
        if (response.success) {
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

  openCommentModal(problem: Problem): void {
    console.log(`Opening comments for problem: ${problem.Title}`);
  }

  markNeedsRefinement(problemId: string): void {
    console.log(`Marked problem ${problemId} as needing refinement`);
  }

  navigateToSingleProblem(problemId: string): void {
    this.hs.addHistory(problemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });

    setTimeout(() => {
      this.router.navigate(['/user/single-problem', problemId]);
    }, 3000);
  }

  viewTestOfDay(): void {
    console.log('Viewing test of the day');
  }

  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }

  applyFilters(): void {
    this.isLoading = true;
    
    // Clone the original problems array to start filtering
    let filtered = [...this.problems];
    
    // Apply search query filter
    if (this.filters.searchQuery) {
      const query = this.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(problem => 
        problem.Title?.toLowerCase().includes(query) || 
        problem.Description?.toLowerCase().includes(query) || 
        problem.ErrorCode?.toLowerCase().includes(query) ||
        problem.Logs?.toLowerCase().includes(query) ||
        problem.Tags?.toLowerCase().includes(query)
      );
    }
    
    // Apply stack filter
    if (this.filters.stack) {
      filtered = filtered.filter(problem => problem.StackId === this.filters.stack);
    }
    
    // Apply category filter
    if (this.filters.category) {
      filtered = filtered.filter(problem => problem.CategoryId === this.filters.category);
    }
    
    // Apply tags filter
    if (this.filters.tags) {
      const tagsToFilter = this.filters.tags.toLowerCase().split(',').map(tag => tag.trim());
      filtered = filtered.filter(problem => {
        if (!problem.Tags) return false;
        const problemTags = problem.Tags.toLowerCase().split(',').map(tag => tag.trim());
        return tagsToFilter.some(tag => problemTags.includes(tag));
      });
    }
    
    // Apply reproducibility filter
    if (this.filters.reproducible === 'true') {
      filtered = filtered.filter(problem => problem.Reproducibility === true);
    }
    
    // Apply sorting
    switch (this.filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime());
        break;
      case 'priority':
        filtered.sort((a, b) => (b.PriorityLevel || 0) - (a.PriorityLevel || 0));
        break;
    }
    
    this.filteredProblems = filtered;
    this.isLoading = false;
  }

  resetFilters(): void {
    this.filters = {
      searchQuery: '',
      stack: '',
      category: '',
      tags: '',
      sortBy: 'newest',
      reproducible: ''
    };
    this.filteredProblems = [...this.problems];
  }

  searchError(): void {
    if (!this.errorSearchQuery) return;
    
    this.isLoading = true;
    
    // Filter problems that match the error message in error code, logs, or description
    const query = this.errorSearchQuery.toLowerCase();
    this.filteredProblems = this.problems.filter(problem => 
      problem.ErrorCode?.toLowerCase().includes(query) || 
      problem.Logs?.toLowerCase().includes(query) ||
      problem.Description?.toLowerCase().includes(query)
    );
    
    // Reset other filters to avoid confusion
    this.filters = {
      searchQuery: this.errorSearchQuery,
      stack: '',
      category: '',
      tags: '',
      sortBy: 'newest',
      reproducible: ''
    };
    
    this.isLoading = false;
    
    // If no results, show notification
    if (this.filteredProblems.length === 0) {
      this.ns.showAlert(SuccessType.Info, 'No matching problems found for your error message.');
    }
  }

  getTagsArray(tagsString?: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  }

  truncateDescription(description?: string): string {
    if (!description) return '';
    return description.length > 150 ? `${description.substring(0, 150)}...` : description;
  }
}