import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alert, SuccessType } from '../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../services/modifiers/notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  message: string = '';
  type = SuccessType.None;
  duration: number = 5000;
  showProgress: boolean = true;

  visible: boolean = false;
  isHiding: boolean = false;
  private timeout: any = null;

  constructor(private ns: NotificationsService) { }

  ngOnInit(): void {
    this.ns.messageType$.subscribe((res) => {
      if (res) {
        this.type = res;
        this.show();
      } else {
        this.type = SuccessType.None;
        this.hide();
      }
    });

    this.ns.message$.subscribe((res) => {
      if (res) {
        this.message = res;
        this.show();
      } else {
        this.message = '';
        this.hide();
      }
    });
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
    }, 300);
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
