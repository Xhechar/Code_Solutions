import { Component, OnInit } from '@angular/core';
import { Category, Problem, Solution, Stack, User } from '../../../../interfaces/solutions.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-problems',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor() { }

  ngOnInit(): void {
    this.loadDummyData();
    this.calculateStats();
    this.filterProblems('all');
  }

  loadDummyData(): void {
    // Create dummy users
    const adminUser: User = {
      UserId: '1',
      FullName: 'Admin User',
      Username: 'admin',
      Email: 'admin@example.com',
      Password: 'password',
      ProfileImage: 'assets/admin-avatar.png',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-01-01'),
      Badge: 'Gold' as any,
      PreviousBadge: 'Silver' as any,
      ProblemsCount: 15,
      Role: 'admin',
      IsSolver: true
    };

    const regularUser: User = {
      UserId: '2',
      FullName: 'John Doe',
      Username: 'johndoe',
      Email: 'john@example.com',
      Password: 'password',
      ProfileImage: 'assets/user-avatar.png',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-02-15'),
      Badge: 'Bronze' as any,
      PreviousBadge: 'None' as any,
      ProblemsCount: 5,
      Role: 'user',
      IsSolver: false
    };

    // Create dummy stacks
    const angularStack: Stack = {
      StackId: '1',
      Name: 'Angular',
      Description: 'A platform for building mobile and desktop web applications',
      Version: '16.0'
    };

    const reactStack: Stack = {
      StackId: '2',
      Name: 'React',
      Description: 'A JavaScript library for building user interfaces',
      Version: '18.2'
    };

    // Create dummy categories
    const frontendCategory: Category = {
      CategoryId: '1',
      Name: 'Frontend',
      Description: 'Issues related to frontend development'
    };

    const backendCategory: Category = {
      CategoryId: '2',
      Name: 'Backend',
      Description: 'Issues related to backend development'
    };

    // Create dummy solutions
    const solution1: Solution = {
      SolutionId: '1',
      Description: 'This solution addresses the issue with Angular component lifecycle hooks.',
      Steps: 'First, make sure you implement OnInit interface correctly. Then, add ngOnInit method to your component class.',
      CodeSamples: `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit {
  ngOnInit() {
    console.log('Component initialized');
  }
}`,
      ImagePath: 'assets/solution-image1.png',
      VideoLink: 'https://example.com/solution-video',
      CreatedAt: new Date('2023-05-10'),
      UpdatedAt: new Date('2023-05-15'),
      ProblemId: '1',
      UserId: '1',
      editing: false
    };

    const solution2: Solution = {
      SolutionId: '2',
      Description: 'Solution for the React component rendering issue.',
      Steps: 'Check if you have proper key attributes on list items. Verify your state management is correct.',
      CodeSamples: `
function MyComponent({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}`,
      ImagePath: 'assets/solution-image2.png',
      VideoLink: undefined,
      CreatedAt: new Date('2023-04-20'),
      UpdatedAt: new Date('2023-04-21'),
      ProblemId: '2',
      UserId: '2',
      editing: false
    };

    // Create dummy problems without expanded property
    this.problems = [
      {
        ProblemId: '1',
        Title: 'Angular Component Not Initializing',
        Description: 'My Angular component is not initializing properly. The lifecycle hooks are not being called.',
        ErrorCode: 'COMP_INIT_ERR',
        Context: 'This happens in a lazy-loaded module.',
        Environment: 'Angular 15, TypeScript 4.8',
        Tags: 'angular, component, lifecycle, initialization',
        Reproducibility: true,
        Logs: 'Error: Cannot read property of undefined...',
        PriorityLevel: 2,
        ImagePath: 'assets/problem-image1.png',
        DateCreated: new Date('2023-05-01'),
        StackId: '1',
        Stack: angularStack,
        CategoryId: '1',
        Category: frontendCategory,
        Solutions: [solution1],
        UserId: '1',
        User: adminUser,
        IsApproved: true
      },
      {
        ProblemId: '2',
        Title: 'React Component Rendering Issues',
        Description: 'My React component is re-rendering too many times and causing performance issues.',
        ErrorCode: undefined,
        Context: 'This happens in a component with many child components.',
        Environment: 'React 18, JavaScript ES6',
        Tags: 'react, rendering, performance, optimization',
        Reproducibility: true,
        Logs: undefined,
        PriorityLevel: 3,
        ImagePath: 'assets/problem-image2.png',
        DateCreated: new Date('2023-04-15'),
        StackId: '2',
        Stack: reactStack,
        CategoryId: '1',
        Category: frontendCategory,
        Solutions: [solution2],
        UserId: '2',
        User: regularUser,
        IsApproved: false
      },
      {
        ProblemId: '3',
        Title: 'Node.js API Authentication Failure',
        Description: 'Authentication middleware is failing to validate JWT tokens properly.',
        ErrorCode: 'AUTH_JWT_INVALID',
        Context: 'This happens on all protected routes.',
        Environment: 'Node.js 18, Express 4',
        Tags: 'node.js, authentication, jwt, middleware',
        Reproducibility: true,
        Logs: 'TypeError: Cannot destructure property...',
        PriorityLevel: 1,
        ImagePath: undefined,
        DateCreated: new Date('2023-06-10'),
        StackId: '2',
        Stack: reactStack,
        CategoryId: '2',
        Category: backendCategory,
        Solutions: [],
        UserId: '1',
        User: adminUser,
        IsApproved: true
      },
      {
        ProblemId: '4',
        Title: 'Angular Service Injection Error',
        Description: 'Cannot inject custom service into component, getting NullInjectorError.',
        ErrorCode: 'NG0201',
        Context: 'When bootstrapping the application.',
        Environment: 'Angular 16, TypeScript 5.0',
        Tags: 'angular, dependency-injection, services',
        Reproducibility: true,
        Logs: 'NullInjectorError: No provider for CustomService!',
        PriorityLevel: 2,
        ImagePath: 'assets/problem-image3.png',
        DateCreated: new Date('2023-07-05'),
        StackId: '1',
        Stack: angularStack,
        CategoryId: '1',
        Category: frontendCategory,
        Solutions: [solution1, solution2],
        UserId: '2',
        User: regularUser,
        IsApproved: false
      },
      {
        ProblemId: '5',
        Title: 'Database Connection Pool Exhaustion',
        Description: 'Database connections are not being properly released, causing pool exhaustion.',
        ErrorCode: 'CONN_POOL_EXHUASTED',
        Context: 'High traffic scenarios.',
        Environment: 'PostgreSQL 14, Node.js 18',
        Tags: 'database, connection-pool, performance',
        Reproducibility: true,
        Logs: 'Error: timeout exceeded when trying to connect',
        PriorityLevel: 1,
        ImagePath: undefined,
        DateCreated: new Date('2023-08-20'),
        StackId: '2',
        Stack: reactStack,
        CategoryId: '2',
        Category: backendCategory,
        Solutions: [],
        UserId: '1',
        User: adminUser,
        IsApproved: true
      }
    ];
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

    // Apply search filter if exists
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

    // Filter based on current filter first
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

    // Then apply search filter
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

  openCreateProblemModal(): void {
    console.log('Opening create problem modal');
  }

  editProblem(problem: Problem, event: MouseEvent): void {
    event.stopPropagation();
    console.log('Editing problem:', problem.ProblemId);
  }

  approveProblem(problem: Problem, event: MouseEvent): void {
    event.stopPropagation();
    console.log('Approving problem:', problem.ProblemId);
    problem.IsApproved = true;
    this.calculateStats();
    this.filterProblems(this.currentFilter);
  }

  deleteProblem(problem: Problem, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this problem?')) {
      console.log('Deleting problem:', problem.ProblemId);
      const index = this.problems.findIndex(p => p.ProblemId === problem.ProblemId);
      if (index !== -1) {
        this.problems.splice(index, 1);
        this.calculateStats();
        this.filterProblems(this.currentFilter);
      }
    }
  }

  toggleSolutionEdit(solution: Solution): void {
    solution.editing = !solution.editing;
  }

  updateSolution(solution: Solution, problem: Problem): void {
    console.log('Updating solution:', solution.SolutionId);
    solution.UpdatedAt = new Date();
    solution.editing = false;
  }

  deleteSolution(solution: Solution, problem: Problem): void {
    if (confirm('Are you sure you want to delete this solution?')) {
      console.log('Deleting solution:', solution.SolutionId);
      const index = problem.Solutions?.findIndex(s => s.SolutionId === solution.SolutionId) ?? -1;
      if (index !== -1 && problem.Solutions) {
        problem.Solutions.splice(index, 1);
      }
    }
  }

  removeImage(solution: Solution, problem: Problem): void {
    if (confirm('Are you sure you want to remove this image?')) {
      console.log('Removing image from solution:', solution.SolutionId);
      solution.ImagePath = undefined;
    }
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
}