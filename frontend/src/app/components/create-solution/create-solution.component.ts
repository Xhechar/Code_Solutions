import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-solution',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-solution.component.html',
  styleUrl: './create-solution.component.css'
})
export class CreateSolutionComponent implements OnInit {
  solutionForm!: FormGroup;
  imageFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  mainPreviewImage: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.solutionForm = this.fb.group({
      description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(500)
      ]],
      steps: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(5000)
      ]],
      codeSamples: ['', [
        Validators.maxLength(10000)
      ]],
      videoLink: ['', [
        Validators.maxLength(500),
        Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
      ]]
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.imageFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
        
        // Set first image as main preview if it's the first image
        if (this.imagePreviewUrls.length === 1) {
          this.mainPreviewImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  selectMainImage(imageUrl: string) {
    this.mainPreviewImage = imageUrl;
  }

  removeImage(index: number, event?: Event) {
    // Prevent click event from propagating
    if (event) {
      event.stopPropagation();
    }

    // Remove from both arrays
    this.imageFiles.splice(index, 1);
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
      const formData = new FormData();
      
      // Append form values
      Object.keys(this.solutionForm.controls).forEach(key => {
        const control = this.solutionForm.get(key);
        if (control && control.value) {
          formData.append(key, control.value);
        }
      });
      
      // Append images
      this.imageFiles.forEach((image, index) => {
        formData.append(`images`, image, image.name);
      });

      // Here you would typically call a service to submit the form
      console.log('Form submitted', formData);
    } else {
      this.markFormGroupTouched(this.solutionForm);
    }
  }

  onCancel() {
    // Reset form and clear images
    this.solutionForm.reset();
    this.imageFiles = [];
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
