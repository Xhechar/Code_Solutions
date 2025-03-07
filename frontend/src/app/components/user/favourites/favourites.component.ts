import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Problem } from '../contributions/my-solutions/my-solutions.component';
import { Router } from '@angular/router';
import { Category } from '../../../interfaces/solutions.interfaces';
import { FormsModule } from '@angular/forms';

interface Favorite {
  id: string;
  problemId: string;
  userId: string;
  dateAdded: Date;
  problem: Problem;
}

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  favorites: Favorite[] = [];
  filteredFavorites: Favorite[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // For remove modal
  showRemoveModal: boolean = false;
  favoriteToRemove: Favorite | null = null;
  
  // For notification messages
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationIsError: boolean = false;
  notificationTimeoutId: any = null;
  
  constructor(
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loadFavorites();
  }
  
  loadFavorites(): void {
    // Create mock data instead of calling a service
    this.createMockData();
    this.applyFilters();
    this.calculateTotalPages();
  }
  
  createMockData(): void {
    // Mock categories for the problems
    const mockCategories: Category[] = [
      {
        CategoryId: '1', 
        Name: 'JavaScript Error',
        Description: 'Common JavaScript runtime and syntax errors'
      },
      {
        CategoryId: '2', 
        Name: 'Database Issue',
        Description: 'Problems related to database connections and queries'
      },
      {
        CategoryId: '3', 
        Name: 'API Integration',
        Description: 'Issues with external API integration and data exchange'
      },
      {
        CategoryId: '4', 
        Name: 'Performance',
        Description: 'Performance bottlenecks and optimization challenges'
      }
    ];
    
    // Create mock problems first
    const mockProblems: Problem[] = Array(20).fill(0).map((_, i) => {
      const hasSolutions = i % 3 === 0; // Every third problem has solutions
      
      return {
        ProblemId: `prob-${i}-${Math.random().toString(36).substring(2, 10)}`,
        Title: `Problem ${i + 1}: ${i % 4 === 0 ? 'Connection Issue' : i % 3 === 0 ? 'API Response Error' : i % 2 === 0 ? 'Performance Bottleneck' : 'Type Mismatch'}`,
        Description: `This is a description for problem ${i + 1}. ${i % 2 === 0 ? 'The issue occurs when trying to connect to the database with incorrect credentials.' : 'Users are experiencing slow response times when loading data.'}`,
        ErrorCode: i % 2 === 0 ? `ERR-${1000 + i}` : undefined,
        Tags: this.getRandomTags(i),
        Reproducibility: i % 2 === 0,
        PriorityLevel: (i % 3) + 1, // 1, 2, or 3 for difficulty level
        ImagePath: i % 4 === 0 ? `/assets/problem-${(i % 3) + 1}.jpg` : undefined,
        DateCreated: new Date(2023, i % 12, (i % 28) + 1),
        StackId: `stack-${(i % 4) + 1}`,
        CategoryId: mockCategories[i % mockCategories.length].CategoryId,
        Category: mockCategories[i % mockCategories.length],
        Solutions: hasSolutions ? [
          { 
            SolutionId: `sol-${i}-1`, 
            Description: 'First solution approach',
            Steps: 'Step 1: Check the connection\nStep 2: Verify credentials\nStep 3: Test with a simple query',
            CodeSamples: 'console.log("Testing connection");',
            CreatedAt: new Date(2023, i % 12, (i % 28) + 1),
            UpdatedAt: new Date(2023, i % 12, (i % 28) + 2),
            ProblemId: `prob-${i}-${Math.random().toString(36).substring(2, 10)}`,
            UserId: `user-${i % 5 + 1}`
          },
          { 
            SolutionId: `sol-${i}-2`, 
            Description: 'Alternative solution approach',
            Steps: 'Step 1: Use a connection pool\nStep 2: Implement retry mechanism\nStep 3: Add proper error handling',
            CodeSamples: 'try {\n  // connection code\n} catch (err) {\n  console.error(err);\n}',
            CreatedAt: new Date(2023, i % 12, (i % 28) + 3),
            UpdatedAt: new Date(2023, i % 12, (i % 28) + 4),
            ProblemId: `prob-${i}-${Math.random().toString(36).substring(2, 10)}`,
            UserId: `user-${(i % 5) + 2}`
          }
        ] : [],
        UserId: `user-${(i % 5) + 1}`
      };
    });
    
    // Create favorites using the mock problems
    this.favorites = mockProblems.map((problem, index) => ({
      id: `fav-${index}-${Math.random().toString(36).substring(2, 8)}`,
      problemId: problem.ProblemId,
      userId: 'current-user-id',
      dateAdded: new Date(2024, (index % 6), (index % 28) + 1), // Some added in current month, some older
      problem: problem
    }));
  }
  
  getRandomTags(index: number): string[] {
    const allTags = ['frontend', 'backend', 'database', 'api', 'server', 'performance', 'security', 'ui', 'cache', 'authentication', 'deployment'];
    const numTags = (index % 3) + 1; // 1 to 3 tags per problem
    const startPos = index % (allTags.length - numTags);
    return allTags.slice(startPos, startPos + numTags);
  }
  
  applyFilters(): void {
    // First apply search filter
    let result = this.favorites;
    
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(favorite => 
        favorite.problem.Title.toLowerCase().includes(searchLower) ||
        favorite.problem.Description.toLowerCase().includes(searchLower) ||
        (favorite.problem.ErrorCode && favorite.problem.ErrorCode.toLowerCase().includes(searchLower)) ||
        (favorite.problem.Category?.Name.toLowerCase().includes(searchLower))
      );
    }
    
    // Then apply solved/unsolved filter
    if (this.activeFilter === 'solved') {
      result = result.filter(favorite => this.isSolved(favorite.problem));
    } else if (this.activeFilter === 'unsolved') {
      result = result.filter(favorite => !this.isSolved(favorite.problem));
    }
    
    this.filteredFavorites = result;
    this.calculateTotalPages();
    this.currentPage = 1; // Reset to first page when filters change
  }
  
  isSolved(problem: Problem): boolean {
    // Logic to determine if a problem is solved
    // For this example, we'll consider problems with solutions as "solved"
    return problem.Solutions !== undefined && problem.Solutions.length > 0;
  }
  
  hasSolutions(problem: Problem): boolean {
    return problem.Solutions !== undefined && problem.Solutions.length > 0;
  }
  
  getDifficultyLabel(level?: number): string {
    switch (level) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
  
  getShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 120 ? `${description.substring(0, 120)}...` : description;
  }
  
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredFavorites.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1; // At least one page even if empty
  }
  
  getCurrentPageItems(): Favorite[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFavorites.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterFavorites();
  }
  
  filterFavorites(): void {
    this.applyFilters();
  }
  
  confirmRemove(favorite: Favorite): void {
    this.favoriteToRemove = favorite;
    this.showRemoveModal = true;
  }
  
  removeFavorite(): void {
    if (this.favoriteToRemove) {
      // In a real app, this would call a service to remove from database
      this.favorites = this.favorites.filter(f => f.id !== this.favoriteToRemove!.id);
      this.applyFilters(); // Re-apply filters to update the view
      
      // Close modal and show notification
      this.showRemoveModal = false;
      this.showNotification = true;
      this.notificationMessage = `"${this.favoriteToRemove.problem.Title}" removed from favorites`;
      this.notificationIsError = false;
      this.favoriteToRemove = null;
      
      // Auto hide notification after 5 seconds
      if (this.notificationTimeoutId) {
        clearTimeout(this.notificationTimeoutId);
      }
      this.notificationTimeoutId = setTimeout(() => {
        this.closeNotification();
      }, 5000);
    }
  }
  
  closeNotification(): void {
    this.showNotification = false;
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId);
      this.notificationTimeoutId = null;
    }
  }
  
  viewProblem(problem: Problem): void {
    // Navigate to problem details page
    this.router.navigate(['/problems', problem.ProblemId]);
  }
  
  viewSolutions(problem: Problem): void {
    // Navigate to solutions page for this problem
    this.router.navigate(['/problems', problem.ProblemId, 'solutions']);
  }
  
  getCategoryCounts(): { top: { name: string, count: number } } {
    // Count problems by category
    const categoryCounts: { [key: string]: number } = {};
    
    this.favorites.forEach(favorite => {
      const categoryName = favorite.problem.Category?.Name || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });
    
    // Find the category with the highest count
    let topCategory = 'None';
    let topCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > topCount) {
        topCategory = category;
        topCount = count;
      }
    });
    
    return {
      top: {
        name: topCategory,
        count: topCount
      }
    };
  }
  
  getRecentCount(): number {
    // Count favorites added in the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.favorites.filter(favorite => {
      const dateAdded = new Date(favorite.dateAdded);
      return dateAdded.getMonth() === currentMonth && dateAdded.getFullYear() === currentYear;
    }).length;
  }
}
