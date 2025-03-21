import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Badge, Problem } from '../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-create-solution',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  RouterLink],
  templateUrl: './create-solution.component.html',
  styleUrl: './create-solution.component.css'
})
export class CreateSolutionComponent implements OnInit {
  solutionForm!: FormGroup;
  imagePreviewUrls: string[] = [];
  mainPreviewImage: string | null = null;
  ProblemId: string = '';
  Problem: Problem = {
    ProblemId: 'PROB-2023-001',
    Title: 'Angular HTTP Interceptor Not Catching 401 Errors',
    Description: 'Our authentication interceptor is not properly catching 401 Unauthorized errors from the API, causing the application to crash instead of redirecting to the login page.',
    ErrorCode: 'HTTP 401',
    Context: 'Authentication flow',
    Environment: 'Production',
    Tags: 'angular,http,authentication,interceptor',
    Reproducibility: true,
    Logs: 'ERROR Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null},"status":401,"statusText":"Unauthorized"...}',
    PriorityLevel: 2,
    ImagePath: '/assets/images/problems/auth-error.png',
    DateCreated: new Date('2023-09-15T10:30:00'),
    StackId: 'STACK-001',
    Stack: {
      StackId: 'STACK-001',
      Name: 'Angular/Node.js',
      Description: 'Frontend Angular with Node.js backend',
      Version: ''
    },
    CategoryId: 'CAT-002',
    IsApproved: true,
    Category: {
      CategoryId: 'CAT-002',
      Name: 'Authentication',
      Description: 'Authentication and authorization issues'
    },
    UserId: 'USER-042',
    User: {
      UserId: 'USER-042',
      Username: 'jsmith',
      Email: 'john.smith@example.com',
      FullName: '',
      Password: '',
      ProfileImage: '',
      IsDeleted: false,
      Notified: false,
      IsWelcomed: false,
      DateCreated: new Date(),
      Badge: Badge.Expert,
      PreviousBadge: Badge.Expert,
      ProblemsCount: 0,
      Role: '',
      IsSolver: false
    }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.solutionForm = this.fb.group({
      Description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(500)
      ]],
      Steps: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(5000)
      ]],
      CodeSamples: ['', [
        Validators.maxLength(10000)
      ]],
      VideoLink: ['', [
        Validators.maxLength(500),
        Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
      ]]
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      let formData : FormData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', 'Code_Solutions');
      formData.append('cloud_name', 'dakyiye2e');

      fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json()).then(res => {
        this.imagePreviewUrls.push(res.secure_url);

        if (this.imagePreviewUrls.length === 1) {
          this.mainPreviewImage = this.imagePreviewUrls[0];
        }
      })

    }
  }

  selectMainImage(imageUrl: string) {
    this.mainPreviewImage = imageUrl;
  }

  removeImage(index: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.imagePreviewUrls.splice(index, 1);

    // Update main preview if needed
    if (this.imagePreviewUrls.length > 0) {
      this.mainPreviewImage = this.imagePreviewUrls[0];
    } else {
      this.mainPreviewImage = null;
    }
  }

  onSubmit() {
    if (this.solutionForm.valid) {
      let solution = {
        ... this.solutionForm.value,
        ImagePath: this.imagePreviewUrls.join(', '),
        ProblemId: this.ProblemId
      }

      console.log(solution);
      
    } else {
      this.markFormGroupTouched(this.solutionForm);
    }
  }

  onCancel() {
    this.solutionForm.reset();
    // this.imageFiles = [];
    this.imagePreviewUrls = [];
    this.mainPreviewImage = null;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
