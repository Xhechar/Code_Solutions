import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { Problem, ProjectStructure, Stack, Stats, SuccessType, User } from '../../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../../services/modifiers/notifications.service';
import { ProblemService } from '../../../services/problem.service';
import { ProjectStructureService } from '../../../services/project-structure.service';
import { StackService } from '../../../services/stack.service';
import { UserService } from '../../../services/user.service';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  searchQuery: string = '';
  notifications: any[] = [];
  showNotifications: boolean = false;
  activeLink: string = 'dashboard';
  activityTimeFrame: string = 'month';
  
  currentAdmin!: User;
  
  // Dashboard statistics
  stats!: Stats;
  
  // Top tech stacks
  topStacks: Stack[] = [];

  // Recent problems
  recentProblems: Problem[] = [];
  
  // New users
  newUsers: User[] = [];
  
  // Recent project structures
  recentProjectStructures: ProjectStructure[] = [];

  constructor(
    private userService: UserService,
    private problemService: ProblemService,
    private stackService: StackService,
    private projectStructureService: ProjectStructureService,
    private ns: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCurrentAdmin();
    this.fetchTopStacks();
    this.fetchRecentProblems();
    this.fetchNewUsers();
    this.fetchRecentProjectStructures();
    
    setTimeout(() => {
      this.initActivityChart();
    }, 100);
  }

  private fetchCurrentAdmin(): void {
    this.userService.getSingleUser().subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.currentAdmin = response.user;
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private fetchTopStacks(): void {
    this.stackService.getAllStacks().subscribe({
      next: (response) => {
        if (response.success && response.stacks) {
          this.topStacks = response.stacks;
          this.calculateStats();
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private fetchRecentProblems(): void {
    this.problemService.getAllProblems().subscribe({
      next: (response) => {
        if (response.success && response.problems) {
          this.recentProblems = (response.problems as Problem[]);
          this.calculateStats();
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private fetchNewUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.newUsers = response.users;
          this.calculateStats();
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private fetchRecentProjectStructures(): void {
    this.projectStructureService.getAllProjectStructures().subscribe({
      next: (response) => {
        if (response.success && response.projects) {
          this.recentProjectStructures = response.projects;
          this.calculateStats();
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private calculateStats(): void {
    const previousStats: Stats = {
      totalUsers: 0,
      userGrowth: 0,
      totalProblems: 0,
      problemGrowth: 0,
      totalSolutions: 0,
      solutionGrowth: 0,
      totalProjects: 0,
      projectGrowth: 0
    };

    const currentTotalUsers = this.newUsers.length;
    const currentTotalProblems = this.recentProblems.length;
    const currentTotalSolutions = this.recentProblems.reduce((sum, problem) => 
      sum + (problem.Solutions?.length || 0), 0);
    const currentTotalProjects = this.recentProjectStructures.length;

    const userGrowth = previousStats.totalUsers > 0 
      ? ((currentTotalUsers - previousStats.totalUsers) / previousStats.totalUsers) * 100 
      : 0;
    const problemGrowth = previousStats.totalProblems > 0 
      ? ((currentTotalProblems - previousStats.totalProblems) / previousStats.totalProblems) * 100 
      : 0;
    const solutionGrowth = previousStats.totalSolutions > 0 
      ? ((currentTotalSolutions - previousStats.totalSolutions) / previousStats.totalSolutions) * 100 
      : 0;
    const projectGrowth = previousStats.totalProjects > 0 
      ? ((currentTotalProjects - previousStats.totalProjects) / previousStats.totalProjects) * 100 
      : 0;

    this.stats = {
      totalUsers: currentTotalUsers,
      userGrowth: Number(userGrowth.toFixed(2)),
      totalProblems: currentTotalProblems,
      problemGrowth: Number(problemGrowth.toFixed(2)),
      totalSolutions: currentTotalSolutions,
      solutionGrowth: Number(solutionGrowth.toFixed(2)),
      totalProjects: currentTotalProjects,
      projectGrowth: Number(projectGrowth.toFixed(2))
    };
  }

  search(): void {
    console.log('Searching for:', this.searchQuery);
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
    this.ns.showAlert(SuccessType.Info, `Navigating to ${link}`);
  }

  setActivityTimeFrame(timeFrame: string): void {
    this.activityTimeFrame = timeFrame;
    this.ns.showAlert(SuccessType.Info, `Changing activity time frame to ${timeFrame}`);
    this.updateActivityChart();
  }

  viewProblem(problemId: string): void {
    this.router.navigate(['/single-problem', problemId]);
  }

  viewUserProfile(userId: string): void {
    // Navigate to user profile
  }

  messageUser(userId: string): void {
    // Open messaging interface
  }

  viewProjectStructure(projectId: String): void {
    this.router.navigate(['/single-project-structure', projectId]);
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
    this.initActivityChart();
  }
}