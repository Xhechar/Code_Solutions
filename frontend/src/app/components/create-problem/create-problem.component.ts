import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, Stack } from '../../interfaces/solutions.interfaces';
import { Title } from 'chart.js';

@Component({
  selector: 'app-create-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-problem.component.html',
  styleUrl: './create-problem.component.css'
})
export class CreateProblemComponent implements OnInit{
  problemForm!: FormGroup;
  uploadedImages: string[] = [];
  mainPreviewImage: string | null = null;

  stacks: Stack[] = [
    {
      StackId: '1', Name: 'Angular',
      Description: '',
      Version: ''
    },
    {
      StackId: '2', Name: 'React',
      Description: '',
      Version: ''
    },
    {
      StackId: '3', Name: 'Vue',
      Description: '',
      Version: ''
    },
    {
      StackId: '4', Name: 'Node.js',
      Description: '',
      Version: ''
    },
    {
      StackId: '5', Name: 'Python',
      Description: '',
      Version: ''
    }
  ];

  categories: Category[] = [
    {
      CategoryId: '1', Name: 'Frontend',
      Description: ''
    },
    {
      CategoryId: '2', Name: 'Backend',
      Description: ''
    },
    {
      CategoryId: '3', Name: 'Database',
      Description: ''
    },
    {
      CategoryId: '4', Name: 'DevOps',
      Description: ''
    },
    {
      CategoryId: '5', Name: 'Full Stack',
      Description: ''
    }
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.problemForm = this.fb.group({
      Title: ['', [
        Validators.required, 
        Validators.minLength(4),
        Validators.maxLength(100)
      ]],
      Description: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      StackId: ['', Validators.required],
      CategoryId: ['', Validators.required],
      ErrorCode: ['', [Validators.maxLength(50)]],
      Context: ['', [Validators.maxLength(500)]],
      Environment: ['', [Validators.maxLength(500)]],
      Tags: ['', Validators.required],
      Reproducibility: [false, Validators.required],
      Logs: ['', [Validators.maxLength(10000)]],
      PriorityLevel: [2, [
        Validators.required,
        Validators.min(0),
        Validators.max(5)
      ]]
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
          
          // Set first image as main preview if no preview exists
          if (!this.mainPreviewImage) {
            this.mainPreviewImage = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  selectMainImage(image: string): void {
    this.mainPreviewImage = image;
  }

  removeImage(index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.uploadedImages.splice(index, 1);
    
    // If main preview was removed, set new main preview or reset
    if (this.mainPreviewImage === this.uploadedImages[index]) {
      this.mainPreviewImage = this.uploadedImages.length > 0 
        ? this.uploadedImages[0] 
        : null;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.problemForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.problemForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.capitalizeFirstLetter(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      return `${this.capitalizeFirstLetter(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters long`;
    }
    if (field.hasError('maxlength')) {
      return `${this.capitalizeFirstLetter(fieldName)} must not exceed ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onSubmit(): void {
    if (this.problemForm.valid) {

      console.log('Submitting problem:', this.problemForm.value);
      
      this.resetForm();
    } else {
      Object.keys(this.problemForm.controls).forEach(field => {
        const control = this.problemForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onCancel(): void {
    // Reset the form and clear uploaded images
    this.resetForm();
  }

  private resetForm(): void {
    this.problemForm.reset({
      title: '',
      description: '',
      stackId: '',
      categoryId: '',
      errorCode: '',
      context: '',
      environment: '',
      tags: '',
      reproducibility: false,
      logs: '',
      priorityLevel: 2
    });
    
    this.uploadedImages = [];
    this.mainPreviewImage = null;
    
    // Reset file input
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
