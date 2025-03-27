import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { SuccessType } from '../../interfaces/solutions.interfaces';
import { NotificationsComponent } from "../notifications/notifications.component";
import { ModalService } from '../../services/modifiers/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  isModalVisible = false;

  constructor(private as: AuthService, private ns: NotificationsService, private ms: ModalService, private router: Router) {}

  ngOnInit(): void {
    this.ms.isVisible$.subscribe(res => {
      this.isModalVisible = res;
    });
  }

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  confirmLogout() {
    this.as.logout().subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        }
        this.closeModal();
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error as string);
        this.closeModal();
      }
    });
  }
}
