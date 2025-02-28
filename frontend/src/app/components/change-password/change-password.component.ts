import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface RecoveryDetails {
  Email: string;
  RecoveryCode: string;
  NewPassword: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
export class ChangePasswordComponent {
  recoveryDetails: RecoveryDetails = {
    Email: '',
    RecoveryCode: '',
    NewPassword: ''
  };
  
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
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 20; // Has uppercase
    if (/[a-z]/.test(password)) strength += 20; // Has lowercase
    if (/[0-9]/.test(password)) strength += 20; // Has numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Has special chars
    
    return strength;
  }

  getPasswordStrengthText(password: string): string {
    const strength = this.calculatePasswordStrength(password);
    
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  }

  onSubmit(): void {
    // Handle form submission
    console.log('Password reset submitted:', this.recoveryDetails);
    // Call your reset password service here
  }
}
