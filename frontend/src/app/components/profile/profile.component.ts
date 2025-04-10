import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, History, RecentActivities, SuccessType } from '../../interfaces/solutions.interfaces';
import { UserService } from '../../services/user.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;

  showEditForm: boolean = false;

  userEdit: { FullName: string; Username: string; Email: string } = {
    FullName: '',
    Username: '',
    Email: ''
  };

  isAdmin: boolean = false;
  completedTestsCount: number = 18;
  totalTestsCount: number = 30;
  testDays: any[] = [];

  recentHistory: History[] = [];

  recentActivities: RecentActivities[] = [
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
  isProfileUploading: boolean = false;

  constructor(private us: UserService, private ns: NotificationsService) { }

  ngOnInit(): void {
    this.loadUserData();

    this.generateTestDays();
    this.loadRecentHistory();
  }

  loadUserData(): void {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user as User;
          this.isAdmin = this.user.Role === 'admin';
        } else {
          console.error('Failed to load user data:', response.error);
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  generateTestDays(): void {
    const today = new Date();
    const currentDay = today.getDate();
    
    for (let i = 1; i <= 7; i++) {
      this.testDays.push({
        number: i,
        completed: i <= this.completedTestsCount,
        current: i === currentDay,
        past: i < currentDay
      });
    }
  }

  loadRecentHistory(): void {
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

  isProfileComplete(): boolean {
    return !!(
      this.user.FullName && 
      this.user.Email && 
      this.user.Username && 
      this.user.ProfileImage
    );
  }

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

  updateProfile(user: Partial<User>): void {
    this.us.updateUser(user).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          this.loadUserData();
          this.showEditForm = false;
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      }
      , error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  onProfileImageChange(event: any): void {
    let image = event.target.files[0];

    if (!image) {
      this.ns.showAlert(SuccessType.Warning, 'Please select an image to upload!');
      return;
    } else {
      this.isProfileUploading = true;

      let formData = new FormData();

      formData.append('file', image);
      formData.append('upload_preset', 'Code_Solutions');
      formData.append('cloud_name', 'dakyiye2e');

      fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(res => {
        this.us.updateProfileImage(res.secure_url).subscribe({
          next: (response) => {
            if (response.success) {
              
              this.user.ProfileImage = res.url;
              this.ns.showAlert(SuccessType.Success, response.message as string);
              this.loadUserData();
              this.isProfileUploading = false;
            } else {
              this.ns.showAlert(SuccessType.Warning, response.error as string);
              this.isProfileUploading = false;
            }
          },
          error: (error) => {
            this.ns.showAlert(SuccessType.Error, error.error.error as string);
            this.isProfileUploading = false;
          }
        })
      })
    }
  }
}
