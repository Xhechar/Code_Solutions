import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Problem {
  ProblemId: string;
  Title: string;
  Description: string;
  Tags?: string[];
  ImagePath?: string[];
  Solver?: User;
  Origin: 'user' | 'team';
}

interface User {
  UserId: string;
  FullName: string;
  Username: string;
  ProfileImage: string;
  Badge: {
    primary: boolean;
    secondary: boolean;
    tertiary: boolean;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  problems: Problem[] = [];
  testCount: number = 0;
  currentImageIndex: { [key: string]: number } = {};

  constructor() {}

  ngOnInit(): void {
    this.generateDummyProblems();
    this.testCount = this.generateTestCount();
  }

  generateDummyProblems(): void {
    this.problems = [
      // User-created Problems
      {
        ProblemId: 'prob001',
        Title: 'Debugging Complex State Management in React',
        Description: 'Navigating through intricate state synchronization challenges in a large-scale React application with multiple interdependent components.',
        Tags: ['React', 'State Management', 'Performance'],
        ImagePath: [
          'https://i.pinimg.com/736x/0b/e3/38/0be338597e4ad2ae04f7396f73ba1f93.jpg',
          'https://i.pinimg.com/736x/09/82/37/098237dda053bb4b06eb2a439448d5f9.jpg'
        ],
        Solver: {
          UserId: 'user001',
          FullName: 'Emily Rodriguez',
          Username: 'emilyrod',
          ProfileImage: 'https://i.pinimg.com/236x/73/a9/0c/73a90c529c97dece141df5b8e4b20fc3.jpg',
          Badge: {
            primary: true,
            secondary: false,
            tertiary: false
          }
        },
        Origin: 'user'
      },
      {
        ProblemId: 'prob002',
        Title: 'Performance Bottlenecks in Node.js Microservices',
        Description: 'Identifying and resolving latency issues in a distributed microservices architecture, focusing on efficient communication and resource utilization.',
        Tags: ['Node.js', 'Microservices', 'Performance'],
        ImagePath: [
          'https://i.pinimg.com/236x/d5/43/43/d54343cbb7d3c6477cb21596fea3e81a.jpg',
          'https://i.pinimg.com/736x/09/82/37/098237dda053bb4b06eb2a439448d5f9.jpg'
        ],
        Solver: {
          UserId: 'user002',
          FullName: 'Alex Chen',
          Username: 'alexchen',
          ProfileImage: 'https://i.pinimg.com/236x/73/a9/0c/73a90c529c97dece141df5b8e4b20fc3.jpg',
          Badge: {
            primary: false,
            secondary: true,
            tertiary: false
          }
        },
        Origin: 'user'
      },
      // Admin-created Problems
      {
        ProblemId: 'prob003',
        Title: 'Advanced TypeScript Type Challenges',
        Description: 'Exploring complex type system capabilities in TypeScript, including advanced generic type manipulations and conditional types.',
        Tags: ['TypeScript', 'Advanced Types', 'Generics'],
        ImagePath: [
          'https://i.pinimg.com/236x/ae/95/27/ae95277bc2a762bf68529c4afb0e9142.jpg',
          'https://i.pinimg.com/736x/09/82/37/098237dda053bb4b06eb2a439448d5f9.jpg'
        ],
        Origin: 'team'
      },
      {
        ProblemId: 'prob004',
        Title: 'Kubernetes Deployment Optimization',
        Description: 'Strategies for improving container orchestration efficiency, reducing resource consumption, and enhancing scalability in Kubernetes environments.',
        Tags: ['Kubernetes', 'DevOps', 'Cloud Native'],
        ImagePath: [
          'https://i.pinimg.com/736x/09/82/37/098237dda053bb4b06eb2a439448d5f9.jpg',
          'https://i.pinimg.com/236x/5a/99/e2/5a99e279b83573c11644173ca8349912.jpg'
        ],
        Origin: 'team'
      }
    ];

    // Initialize image indices
    this.problems.forEach(problem => {
      if (problem.ImagePath) {
        this.currentImageIndex[problem.ProblemId] = 0;
      }
    });
  }

  generateTestCount(): number {
    // Simulate test count generation
    return Math.floor(Math.random() * 50) + 10;
  }

  switchImage(problem: Problem, direction: 'left' | 'right'): void {
    if (!problem.ImagePath || problem.ImagePath.length <= 1) return;

    const currentIndex = this.currentImageIndex[problem.ProblemId];
    const totalImages = problem.ImagePath.length;

    if (direction === 'left') {
      this.currentImageIndex[problem.ProblemId] = 
        (currentIndex - 1 + totalImages) % totalImages;
    } else {
      this.currentImageIndex[problem.ProblemId] = 
        (currentIndex + 1) % totalImages;
    }
  }

  getCurrentImage(problem: Problem): string {
    return problem.ImagePath 
      ? problem.ImagePath[this.currentImageIndex[problem.ProblemId]] 
      : '';
  }

  addToFavourites(problemId: string): void {
    console.log(`Added problem ${problemId} to favourites`);
    // Simulated favourite action
  }

  openCommentModal(problem: Problem): void {
    console.log(`Opening comments for problem: ${problem.Title}`);
    // Simulated comment modal opening
  }

  markNeedsRefinement(problemId: string): void {
    console.log(`Marked problem ${problemId} as needing refinement`);
    // Simulated refinement marking
  }

  viewTestOfDay(): void {
    console.log('Viewing test of the day');
    // Simulated test of day view
  }

  searchError(){}
}
