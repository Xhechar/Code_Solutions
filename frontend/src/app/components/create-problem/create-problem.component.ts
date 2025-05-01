import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Problem, Stack, SuccessType } from '../../interfaces/solutions.interfaces';
import { StackService } from '../../services/stack.service';
import { CategoryService } from '../../services/category.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProblemService } from '../../services/problem.service';
import { ModalService } from '../../services/modifiers/modal.service';

@Component({
  selector: 'app-create-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './create-problem.component.html',
  styleUrl: './create-problem.component.css'
})
export class CreateProblemComponent implements OnInit{
  problemForm!: FormGroup;
  uploadedImages: string[] = [];
  mainPreviewImage: string | null = null;
  updateProblemData: Problem | null = null;

  stacks: Stack[] = [];

  categories: Category[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder, private ss: StackService, private cs: CategoryService, private ns: NotificationsService, private ps: ProblemService, private ms: ModalService) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchStacks();
    this.fetchCategories();
    this.ms.updateProblemData$.subscribe((problem) => {
      if (problem) {
        this.updateProblemData = problem;
        this.problemForm.patchValue({
          Title: problem.Title,
          Description: problem.Description,
          StackId: problem.StackId,
          CategoryId: problem.CategoryId,
          ErrorCode: problem.ErrorCode,
          Context: problem.Context,
          Environment: problem.Environment,
          Tags: problem.Tags,
          Reproducibility: problem.Reproducibility,
          Logs: problem.Logs,
          PriorityLevel: problem.PriorityLevel
        });
        this.uploadedImages = problem.ImagePath ? problem.ImagePath.split(', ') : [];
        this.mainPreviewImage = this.uploadedImages.length > 0 ? this.uploadedImages[0] : null;
      }
    });
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
        this.uploadedImages.push(res.secure_url);

        if (this.uploadedImages.length === 1) {
          this.mainPreviewImage = this.uploadedImages[0];
        }
      })

    }
  }

  fetchStacks() {
    this.ss.getAllStacks().subscribe({
      next: (response) => {
        if (response.success) {
          this.stacks = response.stacks as Stack[];
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }

  fetchCategories() {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories as Category[];
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }

  selectMainImage(image: string): void {
    this.mainPreviewImage = image;
  }

  removeImage(index: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.uploadedImages.splice(index, 1);
    
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

      let formValue: Problem = {
        ... this.problemForm.value,
        PriorityLevel: parseInt(this.problemForm.value.PriorityLevel),
        ImagePath: this.uploadedImages.join(', ')
      };

      if (this.updateProblemData) {
        this.ps.updateProblem(this.updateProblemData.ProblemId, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showAlert(SuccessType.Success, response.message as string);
            } else {
              this.ns.showAlert(SuccessType.Warning, response.error as string);
            }
          },
          error: (error) => {
            this.ns.showAlert(SuccessType.Error, error.error.error as string);
          }
        });
      } else {
        this.ps.createProblem(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showAlert(SuccessType.Success, response.message as string);
            } else {
              this.ns.showAlert(SuccessType.Warning, response.error as string);
            }
          },
          error: (error) => {
            this.ns.showAlert(SuccessType.Error, error.error.error as string);
          }
        });
      }
      
      this.resetForm();
    } else {
      Object.keys(this.problemForm.controls).forEach(field => {
        const control = this.problemForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.ms.clearUpdateProblemData();
    history.back();
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
    
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
