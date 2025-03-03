import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  iconClass: string;
  unread: boolean;
}

@Component({
  selector: 'app-a-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './a-top-bar.component.html',
  styleUrl: './a-top-bar.component.css'
})
export class ATopBarComponent implements OnInit {
  user: User = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: 'https://i.pinimg.com/236x/0e/4a/a6/0e4aa6a4ebdc37403fc2c8cfa28b259f.jpg'
  };

  notifications: Notification[] = [
    {
      id: 1,
      text: '<strong>New Solution:</strong> User JohnDev added a solution to "TypeError in React useEffect"',
      time: '10 minutes ago',
      iconClass: 'fas fa-star',
      unread: true
    },
    {
      id: 2,
      text: '<strong>Report Submitted:</strong> Error report "NullPointerException in Spring Boot" requires review',
      time: '1 hour ago',
      iconClass: 'fas fa-exclamation-circle',
      unread: true
    },
    {
      id: 3,
      text: '<strong>New User:</strong> 5 new users registered today',
      time: '3 hours ago',
      iconClass: 'fas fa-user',
      unread: true
    },
    {
      id: 4,
      text: '<strong>Trending Solution:</strong> "Fixing CORS errors in Node.js" has reached 1000 views',
      time: 'Yesterday',
      iconClass: 'fas fa-arrow-up',
      unread: false
    }
  ];

  showProfileMenu: boolean = false;
  showNotifications: boolean = false;
  unreadNotifications: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.updateUnreadCount();
  }

  updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => n.unread).length;
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleCreateMenu(event: Event): void {
    event.stopPropagation();
    // Implement create menu functionality here
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.unread = false;
    });
    this.updateUnreadCount();
  }

  @HostListener('document:click')
  closeDropdowns(): void {
    this.showProfileMenu = false;
    this.showNotifications = false;
  }
}
