import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  message: string = 'Unable to connect to server.';
  type: 'success' | 'error' | 'warning' | 'info' = 'success';
  duration: number = 5000;
  showProgress: boolean = true;

  visible: boolean = false;
  isHiding: boolean = false;
  private timeout: any = null;

  constructor() { }

  ngOnInit(): void {
    this.show();
  }

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  show(): void {
    this.visible = true;
    
    if (this.duration > 0) {
      this.timeout = setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  hide(): void {
    this.isHiding = true;
    
    setTimeout(() => {
      this.visible = false;
      this.isHiding = false;
    }, 300); // Duration of the slide-out animation
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
