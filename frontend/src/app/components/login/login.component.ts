import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { LoginDetails, SuccessType } from '../../interfaces/solutions.interfaces';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, NotificationsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private as: AuthService,
    private ns: NotificationsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.animateFormElements();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    if (!formControl) {
      return false;
    }
    return formControl.invalid && (formControl.dirty || formControl.touched);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      let newForm = {
        ...this.loginForm.value
      };
      delete newForm.rememberMe;

      this.as.login(newForm as LoginDetails).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showAlert(SuccessType.Success, response.message as string);

            if(response.role == 'user') {
              setTimeout(() => {
                this.router.navigate(['/user']);
              }, 4000);
            } else if (response.role == 'admin') {
              setTimeout(() => {
                this.router.navigate(['/admin'])
              }, 4000);
            } else {
              this.ns.showAlert(SuccessType.Warning, 'You cannot access this service.');
            }
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          console.log(error);
          
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        },
      });
      if (this.loginForm) {
        Object.keys(this.loginForm.controls).forEach((key) => {
          this.loginForm.get(key)?.markAsTouched();
        });
      }
    }
  }

  // Method to animate form elements sequentially
  private animateFormElements(): void {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
      }, 100 * (index + 1));
    });
  }
}
