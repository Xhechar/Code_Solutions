import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { SuccessType } from '../../interfaces/solutions.interfaces';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';

interface Emailer {
  Email: string;
}

@Component({
  selector: 'app-verify-mail',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './verify-mail.component.html',
  styleUrl: './verify-mail.component.css'
})
export class VerifyMailComponent {
  
  constructor(private as: AuthService, private ns: NotificationsService, private router: Router){}
  onSubmit(mail: Emailer) {
    this.as.verifyEmail(mail.Email).subscribe({
      next: (res) => {
        if (res.success) {
          this.ns.showAlert(SuccessType.Success, res.message as string);

          setTimeout(() => {
            this.router.navigate(['/change-password', mail.Email]);
          }, 4000);
        } else {
          this.ns.showAlert(SuccessType.Warning, res.error as string);
        }
      },
      error: (err) => {
        this.ns.showAlert(SuccessType.Error, err.error.error as string);
      }
    });
  }
}
