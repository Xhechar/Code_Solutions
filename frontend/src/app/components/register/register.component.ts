import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  imagePreview: string | null = null;
  showPassword = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.animateForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profileImage: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      
      const user: Partial<User> = {
        FullName: formData.fullName,
        Username: formData.username,
        Email: formData.email,
        Password: formData.password,
        ProfileImage: this.imagePreview || ''
      };
      
      console.log('User registered:', user);
      
      // Show success message or redirect
      alert('Registration successful! Welcome to Code Solutions!');
      this.signupForm.reset();
      this.imagePreview = null;
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.signupForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Update form control
      this.signupForm.patchValue({
        profileImage: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  animateForm(): void {
    // Add animation to form elements on load
    setTimeout(() => {
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          (group as HTMLElement).style.opacity = '1';
        }, 100 * index);
      });
    }, 300); // Short delay to ensure DOM is ready
  }
}