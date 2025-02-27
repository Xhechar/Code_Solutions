import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.animateFormElements();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
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
      // Implement your login logic here
      console.log('Login form submitted', this.loginForm.value);
      
      // Simulate successful login after validation
      // In a real app, you'd authenticate with your backend
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 5000);
      if (this.loginForm) {
        Object.keys(this.loginForm.controls).forEach(key => {
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
