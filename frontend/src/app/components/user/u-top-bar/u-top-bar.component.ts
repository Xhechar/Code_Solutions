import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuccessType, User } from '../../../interfaces/solutions.interfaces';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from '../../../services/modifiers/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { SidebarService } from '../../../services/modifiers/sidebar.service';

@Component({
  selector: 'app-u-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationsComponent],
  templateUrl: './u-top-bar.component.html',
  styleUrl: './u-top-bar.component.css'
})
export class UTopBarComponent implements OnInit {
  isProfileMenuOpen = false;
  isCreateMenuOpen = false;
  isSidebarCollapsed = false;

  user!: User;

  constructor(private us: UserService, private ns: NotificationsService, private ss: SidebarService) { }

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user as User;
        } else {
          // console.error('Failed to fetch user details:', response.error);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  toggleSIdebarVisibility(): void {
    this.ss.toggleSidebar();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    // Close other menus
    if (this.isProfileMenuOpen) {
      this.isCreateMenuOpen = false;
    }
  }

  toggleCreateMenu(): void {
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
    
    // Close other menus
    if (this.isCreateMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileElement = document.querySelector('.profile-section');
    const createElement = document.querySelector('.create-button');
    
    if (profileElement && !profileElement.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }
    
    if (createElement && !createElement.contains(event.target as Node)) {
      this.isCreateMenuOpen = false;
    }
  }

  // Prevent closing when clicking inside the menu
  @HostListener('click', ['$event'])
  onComponentClick(event: Event): void {
    event.stopPropagation();
  }
}
