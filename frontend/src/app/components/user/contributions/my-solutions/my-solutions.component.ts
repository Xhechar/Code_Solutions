import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Category {
  CategoryId: string;
  Name: string;
  Description: string;
}

export interface Solution {
  SolutionId: string;
  Description: string;
  Steps?: string;
  CodeSamples?: string;
  ImagePath?: string;
  VideoLink?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ProblemId: string;
  Problem?: Problem;
  UserId: string;
  User?: User;
  ProjectStructure?: ProjectStructure[];
  ApprovalStatus: 'approved' | 'pending';
  HelpfulnessRating?: number;
}

export interface Problem {
  ProblemId: string;
  Title: string;
  Description: string;
  ErrorCode?: string;
  Tags?: string[];
  Reproducibility?: boolean;
  PriorityLevel?: number;
  ImagePath?: string;
  DateCreated: Date;
  StackId?: string;
  CategoryId?: string;
  Category?: Category;
  Solutions?: {SolutionId: string}[];
  UserId: string;
}

export interface User {
  UserId: string;
  Name: string;
  Email?: string;
  ProfileImage?: string;
}

export interface ProjectStructure {
  Path: string;
  Description: string;
}

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
  solutionToDelete: Solution | null = null;
  
  // For notification messages
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationIsError: boolean = false;
  notificationTimeoutId: any = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSolutions();
  }

  loadSolutions(): void {
    // Create mock data instead of calling a service
    this.createMockData();
    this.applyFilters();
    this.calculateTotalPages();
  }

  createMockData(): void {
    // Mock data for demonstration
    const mockCategories: Category[] = [
      {
        CategoryId: '1', 
        Name: 'JavaScript Error',
        Description: 'Common JavaScript and TypeScript errors'
      },
      {
        CategoryId: '2', 
        Name: 'Database Issue',
        Description: 'Database connection and query problems'
      },
      {
        CategoryId: '3', 
        Name: 'API Integration',
        Description: 'Issues with third-party API integration'
      },
      {
        CategoryId: '4', 
        Name: 'Performance',
        Description: 'Application performance optimization'
      }
    ];

    // Create mock user
    const mockUser: User = {
      UserId: 'current-user-id',
      Name: 'Current User',
      Email: 'user@example.com',
      ProfileImage: '/assets/profile-image.jpg'
    };

    // Create mock problems first
    const mockProblems: Problem[] = Array(15).fill(0).map((_, i) => {
      return {
        ProblemId: `prob-${i}-${Math.random().toString(36).substring(2, 10)}`,
        Title: `Problem ${i + 1}: ${i % 4 === 0 ? 'Database Connection Error' : i % 3 === 0 ? 'API Integration Issue' : 'JavaScript Exception'}`,
        Description: `This is a sample description for problem ${i + 1}.`,
        ErrorCode: i % 2 === 0 ? `ERR-${1000 + i}` : undefined,
        Tags: this.getRandomTags(i),
        Reproducibility: i % 2 === 0,
        PriorityLevel: (i % 3) + 1,
        ImagePath: i % 4 === 0 ? `/assets/problem-${(i % 3) + 1}.jpg` : undefined,
        DateCreated: new Date(2023, i % 12, (i % 28) + 1),
        StackId: `stack-${(i % 4) + 1}`,
        CategoryId: mockCategories[i % mockCategories.length].CategoryId,
        Category: mockCategories[i % mockCategories.length],
        Solutions: [],
        UserId: mockUser.UserId,
      };
    });

    // Create sample project structures
    const sampleProjectStructures: ProjectStructure[] = [
      { Path: 'src/app/components', Description: 'Components directory' },
      { Path: 'src/app/services', Description: 'Services directory' },
      { Path: 'src/app/models', Description: 'Data models' },
      { Path: 'src/assets', Description: 'Static assets' }
    ];

    // Now create solutions linked to problems
    this.solutions = Array(20).fill(0).map((_, i) => {
      const problemIndex = i % mockProblems.length;
      const problem = mockProblems[problemIndex];
      const approved = i % 3 === 0; // Every third solution is approved
      
      const solution: Solution = {
        SolutionId: `sol-${i}-${Math.random().toString(36).substring(2, 10)}`,
        Description: this.getRandomSolutionDescription(i),
        Steps: this.getRandomSteps(i),
        CodeSamples: i % 2 === 0 ? this.getRandomCodeSample(i) : undefined,
        ImagePath: i % 5 === 0 ? `/assets/solution-${(i % 3) + 1}.jpg` : undefined,
        VideoLink: i % 7 === 0 ? 'https://example.com/tutorial-video' : undefined,
        CreatedAt: new Date(2023, (i % 12), (i % 28) + 1),
        UpdatedAt: new Date(2023, (i % 12), (i % 28) + 3),
        ProblemId: problem.ProblemId,
        Problem: problem,
        UserId: mockUser.UserId,
        User: mockUser,
        ProjectStructure: i % 4 === 0 ? sampleProjectStructures : undefined,
        ApprovalStatus: approved ? 'approved' : 'pending',
        HelpfulnessRating: approved ? Math.floor(Math.random() * 3) + 3 : undefined // Random rating 3-5 if approved
      };
      
      if (approved) {
        // Add this solution to the problem's solutions array
        problem.Solutions = [...(problem.Solutions || []), { SolutionId: solution.SolutionId }];
      }
      
      return solution;
    });
  }

  getRandomSolutionDescription(seed: number): string {
    const descriptions = [
      "I found that the issue was related to incorrect database connection strings. Updating the configuration resolved it.",
      "The API was timing out because of missing pagination parameters. Adding proper paging fixed the problem.",
      "This was caused by a memory leak in the event handlers. Properly removing listeners solved it.",
      "The performance issue was resolved by implementing proper indexing on the database queries.",
      "The JavaScript error was occurring due to asynchronous operations not being properly managed. Using async/await fixed it.",
      "I discovered the root cause was in the authentication flow. Updating the token refresh logic resolved the issue.",
      "This problem was due to browser compatibility issues. Adding polyfills for older browsers fixed it.",
      "The error occurred because of missing error handling in the promise chain. Adding proper catch blocks resolved it.",
      "Database connection pooling wasn't configured correctly. Adjusting the pool size resolved the performance issues.",
      "The application was using outdated library versions that had known security vulnerabilities. Updating the dependencies fixed it."
    ];
    
    return descriptions[seed % descriptions.length];
  }

  getRandomSteps(seed: number): string {
    const stepsOptions = [
      "1. Identified the error in the logs\n2. Replicated the issue locally\n3. Found the root cause in the configuration\n4. Updated the settings\n5. Deployed the fix",
      "1. Analyzed network requests\n2. Discovered timeout issues\n3. Added proper pagination\n4. Tested with large datasets\n5. Committed the changes",
      "1. Profiled the application\n2. Found memory leaks\n3. Fixed event handlers\n4. Implemented proper cleanup\n5. Verified memory usage",
      "1. Ran performance tests\n2. Identified slow queries\n3. Added database indices\n4. Optimized joins\n5. Verified improvements"
    ];
    
    return stepsOptions[seed % stepsOptions.length];
  }

  getRandomCodeSample(seed: number): string {
    const codeSamples = [
      `// Before:
connection.query('SELECT * FROM users', (err, results) => {
  if (err) console.error(err);
  // No proper error handling
});

// After:
try {
  const results = await connection.query('SELECT * FROM users');
  return results;
} catch (error) {
  logger.error('Database query failed', error);
  throw new DatabaseException('Failed to fetch users', error);
}`,
      `// Before:
fetch('/api/items')
  .then(response => response.json())
  .then(data => this.setState({ items: data }));

// After:
fetch('/api/items?page=1&limit=20')
  .then(response => {
    if (!response.ok) throw new Error('Network response failed');
    return response.json();
  })
  .then(data => this.setState({ items: data }))
  .catch(error => {
    this.setState({ error: error.message });
    analytics.trackError('API_FETCH_FAILED', error);
  });`,
      `// Before:
document.addEventListener('click', function() {
  // Event listener never removed
});

// After:
const handleClick = function() {
  // Handler logic
};

document.addEventListener('click', handleClick);

// Clean up when component unmounts
function cleanup() {
  document.removeEventListener('click', handleClick);
}`
    ];
    
    return codeSamples[seed % codeSamples.length];
  }

  getRandomTags(seed: number): string[] {
    const allTags = [
      'JavaScript', 'Database', 'API', 'Performance', 'React', 
      'Angular', 'Node.js', 'SQL', 'NoSQL', 'Authentication', 
      'Authorization', 'Caching', 'Memory Leak', 'Frontend', 'Backend'
    ];
    
    const numTags = (seed % 3) + 1; // 1 to 3 tags
    const selectedTags: string[] = [];
    
    for (let i = 0; i < numTags; i++) {
      const tagIndex = (seed + i) % allTags.length;
      selectedTags.push(allTags[tagIndex]);
    }
    
    return selectedTags;
  }

  filterSolutions(): void {
    this.applyFilters();
    this.currentPage = 1; // Reset to first page on filter change
    this.calculateTotalPages();
  }

  applyFilters(): void {
    // First apply search filter
    let filtered = this.solutions.filter(solution => {
      const searchString = this.searchTerm.toLowerCase();
      return (
        solution.Description.toLowerCase().includes(searchString) ||
        (solution.Problem?.Title || '').toLowerCase().includes(searchString) ||
        (solution.Steps || '').toLowerCase().includes(searchString) ||
        (solution.Problem?.Category?.Name || '').toLowerCase().includes(searchString)
      );
    });
    
    // Then apply status filter
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
    return solution.ApprovalStatus === 'approved';
  }

  getApprovedCount(): number {
    return this.solutions.filter(solution => this.isApproved(solution)).length;
  }

  getHelpfulnessRating(): string {
    const approvedSolutions = this.solutions.filter(solution => this.isApproved(solution));
    if (approvedSolutions.length === 0) return '0.0';
    
    const totalRating = approvedSolutions.reduce((sum, solution) => {
      return sum + (solution.HelpfulnessRating || 0);
    }, 0);
    
    return (totalRating / approvedSolutions.length).toFixed(1);
  }

  getShortDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  viewSolution(solution: Solution): void {
    // Navigate to solution detail page
    this.router.navigate(['/solutions', solution.SolutionId]);
  }

  editSolution(solution: Solution): void {
    // Navigate to solution edit page
    this.router.navigate(['/solutions/edit', solution.SolutionId]);
  }

  viewRelatedProblem(solution: Solution): void {
    if (solution.Problem) {
      // Navigate to problem detail page
      this.router.navigate(['/problems', solution.Problem.ProblemId]);
    }
  }

  confirmDelete(solution: Solution): void {
    this.solutionToDelete = solution;
    this.showDeleteModal = true;
  }

  deleteSolution(): void {
    if (!this.solutionToDelete) return;
    
    try {
      // In a real app, you would call a service method here
      // For demo, we'll just filter out the solution from the array
      const solutionId = this.solutionToDelete.SolutionId;
      this.solutions = this.solutions.filter(s => s.SolutionId !== solutionId);
      
      // Apply filters to update the view
      this.applyFilters();
      this.calculateTotalPages();
      
      // Close modal
      this.showDeleteModal = false;
      this.solutionToDelete = null;
      
      // Show success notification
      this.showNotification = true;
      this.notificationMessage = 'Solution deleted successfully!';
      this.notificationIsError = false;
      this.setNotificationTimeout();
    } catch (error) {
      // Show error notification
      this.showNotification = true;
      this.notificationMessage = 'Failed to delete solution. Please try again.';
      this.notificationIsError = true;
      this.setNotificationTimeout();
      
      // Close modal
      this.showDeleteModal = false;
      this.solutionToDelete = null;
    }
  }

  setNotificationTimeout(): void {
    // Clear any existing timeout
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId);
    }
    
    // Set new timeout to automatically hide notification after 5 seconds
    this.notificationTimeoutId = setTimeout(() => {
      this.showNotification = false;
      this.notificationTimeoutId = null;
    }, 5000);
  }

  closeNotification(): void {
    this.showNotification = false;
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId);
      this.notificationTimeoutId = null;
    }
  }
}
