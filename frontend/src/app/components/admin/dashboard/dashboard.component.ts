import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  searchQuery: string = '';
  notifications: any[] = [];
  showNotifications: boolean = false;
  activeLink: string = 'dashboard';
  activityTimeFrame: string = 'month';
  
  // Current admin user
  currentAdmin: any = {
    UserId: 1,
    FullName: 'Admin User',
    Email: 'admin@example.com',
    ProfileImage: 'assets/admin-avatar.png'
  };
  
  // Dashboard statistics
  stats: any = {
    totalUsers: 5842,
    userGrowth: 12.5,
    totalProblems: 1247,
    problemGrowth: 8.3,
    totalSolutions: 982,
    solutionGrowth: 15.7,
    totalProjects: 384,
    projectGrowth: -2.4
  };
  
  // Top tech stacks
  topStacks: any[] = [
    {
      Name: 'MEAN Stack',
      Version: '2.0',
      problemCount: 124,
      solutionCount: 98
    },
    {
      Name: 'React/Redux',
      Version: '18.2',
      problemCount: 97,
      solutionCount: 86
    },
    {
      Name: 'Laravel/Vue',
      Version: '9.2',
      problemCount: 76,
      solutionCount: 53
    },
    {
      Name: 'ASP.NET Core',
      Version: '7.0',
      problemCount: 68,
      solutionCount: 42
    },
    {
      Name: 'Django/React',
      Version: '4.1',
      problemCount: 54,
      solutionCount: 37
    }
  ];

  // Recent problems
  recentProblems: any[] = [
    {
      ProblemId: 1,
      Title: 'Angular Service Injection in Lazy Loaded Modules',
      Description: 'I\'m having issues with service injection in lazy loaded modules. The service is provided in the root module but is creating a new instance in the lazy loaded module.',
      Category: { Name: 'Dependency Injection' },
      Stack: { Name: 'Angular' },
      DateCreated: new Date('2025-02-28'),
      User: {
        UserId: 2,
        FullName: 'John Doe',
        Username: 'johndoe',
        ProfileImage: 'assets/user1.png'
      }
    },
    {
      ProblemId: 2,
      Title: 'Redux State Not Updating After API Call',
      Description: 'After dispatching an action that makes an API call, the Redux state is not being updated. The API call is successful as confirmed in Network tab.',
      Category: { Name: 'State Management' },
      Stack: { Name: 'React/Redux' },
      DateCreated: new Date('2025-03-01'),
      User: {
        UserId: 3,
        FullName: 'Jane Smith',
        Username: 'janesmith',
        ProfileImage: 'assets/user2.png'
      }
    },
    {
      ProblemId: 3,
      Title: 'MongoDB Aggregation Pipeline Performance Issue',
      Description: 'Our aggregation pipeline is taking too long to execute. We need to optimize it for better performance.',
      Category: { Name: 'Database' },
      Stack: { Name: 'MongoDB' },
      DateCreated: new Date('2025-03-03'),
      User: {
        UserId: 4,
        FullName: 'Alex Johnson',
        Username: 'alexj',
        ProfileImage: 'assets/user3.png'
      }
    },
    {
      ProblemId: 4,
      Title: 'Laravel Eloquent Relationship Loading Too Many Records',
      Description: 'When eager loading relationships in Laravel, it\'s pulling too many records and causing memory issues.',
      Category: { Name: 'ORM' },
      Stack: { Name: 'Laravel' },
      DateCreated: new Date('2025-03-05'),
      User: {
        UserId: 5,
        FullName: 'Sarah Wilson',
        Username: 'sarahw',
        ProfileImage: 'assets/user4.png'
      }
    }
  ];
  
  // New users
  newUsers: any[] = [
    {
      UserId: 6,
      FullName: 'Mike Thompson',
      Username: 'miket',
      ProfileImage: 'assets/user5.png',
      Badge: 'intermediate',
      DateCreated: new Date('2025-03-01'),
      ProblemsCount: 3,
      Solutions: [1, 2]
    },
    {
      UserId: 7,
      FullName: 'Emily Davis',
      Username: 'emilyd',
      ProfileImage: 'assets/user6.png',
      Badge: 'beginner',
      DateCreated: new Date('2025-03-02'),
      ProblemsCount: 1,
      Solutions: []
    },
    {
      UserId: 8,
      FullName: 'David Kim',
      Username: 'davidk',
      ProfileImage: 'assets/user7.png',
      Badge: 'expert',
      DateCreated: new Date('2025-03-03'),
      ProblemsCount: 0,
      Solutions: [3, 4, 5]
    },
    {
      UserId: 9,
      FullName: 'Lisa Chen',
      Username: 'lisac',
      ProfileImage: 'assets/user8.png',
      Badge: 'advanced',
      DateCreated: new Date('2025-03-04'),
      ProblemsCount: 2,
      Solutions: [6]
    }
  ];
  
  // Recent project structures
  recentProjectStructures: any[] = [
    {
      ProjectId: 1,
      Title: 'React Monorepo Structure',
      Description: 'A standardized structure for React apps in a monorepo setup with shared libraries.',
      Stack: { Name: 'React' },
      LastUpdated: new Date('2025-02-20'),
      PSG: [1, 2, 3, 4]
    },
    {
      ProjectId: 2,
      Title: 'Microservices with Spring Boot',
      Description: 'Best practices for organizing microservices with Spring Boot and Spring Cloud.',
      Stack: { Name: 'Spring Boot' },
      LastUpdated: new Date('2025-02-25'),
      PSG: [5, 6, 7]
    },
    {
      ProjectId: 3,
      Title: 'Angular Enterprise Architecture',
      Description: 'Scalable architecture for large Angular applications with modular design.',
      Stack: { Name: 'Angular' },
      LastUpdated: new Date('2025-03-01'),
      PSG: [8, 9, 10, 11, 12]
    },
    {
      ProjectId: 4,
      Title: 'Django REST API Best Practices',
      Description: 'Recommended structure for Django REST Framework APIs with proper separation of concerns.',
      Stack: { Name: 'Django' },
      LastUpdated: new Date('2025-03-04'),
      PSG: [13, 14]
    }
  ];
  
  // Notifications mock data
  mockNotifications: any[] = [
    {
      id: 1,
      type: 'problem',
      message: 'New problem reported: "Next.js SSR not working with custom Express server"',
      time: new Date('2025-03-06T09:15:00'),
      read: false
    },
    {
      id: 2,
      type: 'solution',
      message: 'Solution submitted for: "MongoDB Aggregation Pipeline Performance Issue"',
      time: new Date('2025-03-06T10:30:00'),
      read: false
    },
    {
      id: 3,
      type: 'user',
      message: 'New user registered: Chris Martin',
      time: new Date('2025-03-06T11:45:00'),
      read: true
    },
    {
      id: 4,
      type: 'system',
      message: 'System maintenance scheduled for March 10, 2025, at 02:00 UTC',
      time: new Date('2025-03-05T14:00:00'),
      read: false
    },
    {
      id: 5,
      type: 'problem',
      message: 'Problem flagged for moderation: "Issues with third-party API integration"',
      time: new Date('2025-03-05T16:20:00'),
      read: true
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Load notifications data
    this.notifications = this.mockNotifications;
    
    // Initialize chart after view is ready
    setTimeout(() => {
      this.initActivityChart();
    }, 100);
  }

  // Methods to handle user interactions
  search(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement search functionality
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  viewAllNotifications(): void {
    console.log('View all notifications clicked');
    this.setActiveLink('notifications');
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
    console.log('Active link set to:', link);
  }

  setActivityTimeFrame(timeFrame: string): void {
    this.activityTimeFrame = timeFrame;
    console.log('Activity time frame set to:', timeFrame);
    this.updateActivityChart();
  }

  viewProblem(problemId: number): void {
    console.log('Viewing problem:', problemId);
    // Navigate to problem details
  }

  viewUserProfile(userId: number): void {
    console.log('Viewing user profile:', userId);
    // Navigate to user profile
  }

  messageUser(userId: number): void {
    console.log('Messaging user:', userId);
    // Open messaging interface
  }

  viewProjectStructure(projectId: number): void {
    console.log('Viewing project structure:', projectId);
    // Navigate to project structure details
  }

  getBadgeClass(badge: string): string {
    return badge || 'beginner';
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'problem':
        return 'fa fa-exclamation-circle';
      case 'solution':
        return 'fa fa-lightbulb';
      case 'user':
        return 'fa fa-user';
      case 'system':
        return 'fa fa-cog';
      default:
        return 'fa fa-bell';
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Activity Chart initialization
  private initActivityChart(): void {
    const ctx = document.getElementById('activityChart') as HTMLCanvasElement;
    if (!ctx) return;

    const activityData = {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        problems: [8, 12, 15, 10, 18, 6, 4],
        solutions: [6, 10, 12, 8, 14, 5, 3],
        users: [4, 5, 7, 8, 9, 3, 2]
      },
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        problems: [42, 56, 68, 73],
        solutions: [35, 45, 52, 60],
        users: [22, 28, 34, 38]
      },
      year: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        problems: [120, 135, 150, 168, 172, 185, 190, 205, 220, 235, 242, 250],
        solutions: [95, 110, 125, 145, 155, 165, 172, 180, 190, 205, 215, 225],
        users: [55, 65, 78, 86, 95, 104, 115, 125, 135, 148, 160, 175]
      }
    };

    const currentData = activityData[this.activityTimeFrame as keyof typeof activityData];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: currentData.labels,
        datasets: [
          {
            label: 'Problems',
            data: currentData.problems,
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Solutions',
            data: currentData.solutions,
            borderColor: '#4ecdc4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'New Users',
            data: currentData.users,
            borderColor: '#6c5ce7',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Update chart when time frame changes
  private updateActivityChart(): void {
    // In a real app, this would update the existing chart
    // For this demo, we'll just re-initialize it
    this.initActivityChart();
  }
}
