import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SuccessType, User } from '../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { UserService } from '../../services/user.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NotificationsComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  imagePreview: string | null = null;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private ns: NotificationsService, private us: UserService) {}

  ngOnInit(): void {
    this.initForm();
    this.animateForm();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
      FullName: ['', [Validators.required]],
      Username: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ProfileImage: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.us.createUser(this.signupForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showAlert(SuccessType.Success, response.message as string);
            this.signupForm.reset();
            this.imagePreview = null;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 4000);
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      })
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
      
      let formData = new FormData();

      formData.append('file', file);
      formData.append('cloud_name', 'dakyiye2e');
      formData.append('upload_preset', 'Code_Solutions');

      fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(res => {
        this.imagePreview = res.secure_url;
        this.signupForm.patchValue({ ProfileImage: res.secure_url });
        this.ns.showAlert(SuccessType.Success, 'Image successfully uploaded.')
      })
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  animateForm(): void {
    setTimeout(() => {
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach((group, index) => {
        setTimeout(() => {
          (group as HTMLElement).style.opacity = '1';
        }, 100 * index);
      });
    }, 300);
  }
}