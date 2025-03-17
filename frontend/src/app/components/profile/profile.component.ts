import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, History } from '../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User = {
    UserId: '123',
    FullName: 'John Doe',
    Username: 'johndoe',
    Email: 'john.doe@example.com',
    Password: '',
    ProfileImage: 'assets/images/profile-placeholder.jpg',
    IsDeleted: false,
    Notified: false,
    IsWelcomed: true,
    DateCreated: new Date('2023-01-15'),
    Badge: 'pro' as any,
    PreviousBadge: 'intermediate' as any,
    ProblemsCount: 15,
    Role: 'user',
    IsSolver: true,
    Comments: [],
    Favourites: [],
    Histories: [],
    Problems: [],
    Solutions: []
  };

  showEditForm: boolean = false;

  // Added variable for edit form binding
  userEdit: { FullName: string; Username: string; Email: string } = {
    FullName: '',
    Username: '',
    Email: ''
  };

  // Flag to check if profile belongs to current user
  isCurrentUser: boolean = true;

  // Daily tests data
  completedTestsCount: number = 18;
  totalTestsCount: number = 30;
  testDays: any[] = [];

  // Recent history
  recentHistory: History[] = [];

  // Recent activities (for admin view)
  recentActivities: any[] = [
    {
      type: 'problem',
      text: 'New problem reported: "React component not rendering correctly"',
      time: new Date('2025-03-15T14:30:00')
    },
    {
      type: 'solution',
      text: 'New solution posted for "Angular routing issue with lazy loading"',
      time: new Date('2025-03-15T13:15:00')
    },
    {
      type: 'user',
      text: 'New user registration: Jane Smith',
      time: new Date('2025-03-15T12:00:00')
    },
    {
      type: 'comment',
      text: 'User feedback on solution #1230: "This worked perfectly, thanks!"',
      time: new Date('2025-03-15T11:45:00')
    }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Fetch user data based on the route parameter
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUserData(userId);
      }
    });

    // Generate test days data for the calendar
    this.generateTestDays();
    
    // Load recent history
    this.loadRecentHistory();
  }

  loadUserData(userId: string): void {
    // In a real application, you would fetch user data from your service
    // For example:
    // this.userService.getUserById(userId).subscribe(userData => {
    //   this.user = userData;
    //   this.isCurrentUser = this.authService.getCurrentUserId() === userId;
    //   this.loadRecentHistory();
    // });
    
    console.log(`Loading user data for ID: ${userId}`);
    
    // Check if this is the current user (for edit permissions)
    this.isCurrentUser = userId === 'current-user-id'; // Replace with actual check
  }

  generateTestDays(): void {
    const today = new Date();
    const currentDay = today.getDate();
    
    // Generate 30 days
    for (let i = 1; i <= 30; i++) {
      this.testDays.push({
        number: i,
        completed: i <= this.completedTestsCount,
        current: i === currentDay,
        past: i < currentDay
      });
    }
  }

  loadRecentHistory(): void {
    // In a real application, this would come from your API
    // For example:
    // this.historyService.getUserHistory(this.user.UserId, 5).subscribe(history => {
    //   this.recentHistory = history;
    // });
    
    // Dummy data for demonstration
    if (this.user.Histories && this.user.Histories.length > 0) {
      this.recentHistory = this.user.Histories.slice(0, 5);
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'problem':
        return 'bx-error-circle';
      case 'solution':
        return 'bx-bulb';
      case 'comment':
        return 'bx-comment';
      case 'user':
        return 'bx-user';
      default:
        return 'bx-bell';
    }
  }

  // Method to handle profile image upload
  onProfileImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic
      // In a real application you would use a service to upload the image
      console.log('File selected for upload:', file.name);
      
      // Example of reading the file as a data URL (preview)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.ProfileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method to determine if a user has completed their profile
  isProfileComplete(): boolean {
    return !!(
      this.user.FullName && 
      this.user.Email && 
      this.user.Username && 
      this.user.ProfileImage
    );
  }

  // Method to switch between admin and user views (for demo purposes)
  toggleAdminView(): void {
    this.user.Role = this.user.Role === 'admin' ? 'user' : 'admin';
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.userEdit = {
        FullName: this.user.FullName,
        Username: this.user.Username,
        Email: this.user.Email
      };
    }
  }

  // Added method to update profile with form values
  updateProfile(formValue: { fullName: string; username: string; email: string }): void {
    this.user.FullName = formValue.fullName;
    this.user.Username = formValue.username;
    this.user.Email = formValue.email;
    console.log('Profile updated', this.user);
    this.showEditForm = false;
  }

  // Added method to handle profile image change from file input
  onProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.ProfileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
