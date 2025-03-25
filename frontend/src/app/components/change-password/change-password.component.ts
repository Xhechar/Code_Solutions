import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RecoveryDetails, SuccessType } from '../../interfaces/solutions.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ChangePasswordComponent implements AfterViewInit{
  recoveryDetails: RecoveryDetails = {
    Email: '',
    RecoveryCode: '',
    NewPassword: ''
  };

  @ViewChild('changePasswordForm') changePassword!: NgForm;

  constructor(private router: ActivatedRoute, private as: AuthService, private route: Router, private ns: NotificationsService) {
  }

  ngAfterViewInit(): void {
    this.router.paramMap.subscribe(params => {
      this.recoveryDetails.Email = params.get("Email") as string;
    });
  }
  
  confirmPassword: string = '';
  currentStep: number = 1;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return strength;
  }

  getPasswordStrengthText(password: string): string {
    const strength = this.calculatePasswordStrength(password);
    
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  }

  onSubmit(): void {
    this.as.changePassword(this.recoveryDetails).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          this.route.navigate(['/login']);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.message as string);
      }
    });

    this.resetForm();
  }

  resetForm(): void {
    this.changePassword.resetForm();
    this.recoveryDetails = {
      Email: '',
      RecoveryCode: '',
      NewPassword: ''
    };
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.confirmPassword = '';
  }
}
