import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alert, SucessType } from '../../interfaces/solutions.interfaces';
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
  type = SucessType.None;
  duration: number = 5000;
  showProgress: boolean = true;

  visible: boolean = false;
  isHiding: boolean = false;
  private timeout: any = null;

  constructor(private ns: NotificationsService) { }

  ngOnInit(): void {
    this.ns.alert$.subscribe((res) => {
      if (res) {
        this.message = res.message;
        this.type = res.type;
        this.show();
      } else {
        this.message = '';
        this.type = SucessType.None;
        this.hide();
      }
    })
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
