import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Stack {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-problem.component.html',
  styleUrl: './create-problem.component.css'
})
export class CreateProblemComponent implements OnInit{
  problemForm!: FormGroup;
  uploadedImages: string[] = [];
  mainPreviewImage: string | null = null;

  // Mock data - replace with actual service calls
  stacks: Stack[] = [
    { id: '1', name: 'Angular' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Vue' },
    { id: '4', name: 'Node.js' },
    { id: '5', name: 'Python' }
  ];

  categories: Category[] = [
    { id: '1', name: 'Frontend' },
    { id: '2', name: 'Backend' },
    { id: '3', name: 'Database' },
    { id: '4', name: 'DevOps' },
    { id: '5', name: 'Full Stack' }
  ];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.problemForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(4),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      stackId: ['', Validators.required],
      categoryId: ['', Validators.required],
      errorCode: ['', [Validators.maxLength(50)]],
      context: ['', [Validators.maxLength(500)]],
      environment: ['', [Validators.maxLength(500)]],
      tags: ['', Validators.required],
      reproducibility: [false, Validators.required],
      logs: ['', [Validators.maxLength(10000)]],
      priorityLevel: [2, [
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
      // Convert tags to array
      const formValue = { 
        ...this.problemForm.value,
        tags: this.problemForm.get('tags')?.value.split(',').map((tag: string) => tag.trim())
      };

      // Prepare form data for submission
      const formData = {
        ...formValue,
        images: this.uploadedImages
      };

      // TODO: Implement actual submission logic
      console.log('Submitting problem:', formData);
      
      // Optional: Reset form after submission
      this.resetForm();
    } else {
      // Mark all fields as touched to show validation errors
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
