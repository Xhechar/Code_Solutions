import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationIsError: boolean = false;
  notificationTimeoutId: any = null;

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
