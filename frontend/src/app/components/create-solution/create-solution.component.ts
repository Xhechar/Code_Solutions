import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Badge, Problem, SolutionDto, SuccessType, UpdatePS } from '../../interfaces/solutions.interfaces';
import { ModalService } from '../../services/modifiers/modal.service';
import { SolutionService } from '../../services/solution.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-create-solution',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './create-solution.component.html',
  styleUrl: './create-solution.component.css'
})
export class CreateSolutionComponent implements OnInit {
  solutionForm!: FormGroup;
  imagePreviewUrls: string[] = [];
  mainPreviewImage: string | null = null;
  ProblemId: string = '';
  Problem!: Problem;
  updatePs!: UpdatePS;

  constructor(private fb: FormBuilder, private ms: ModalService, private ss: SolutionService, private ns: NotificationsService) {}

  ngOnInit() {
    this.initializeForm();

    this.ms.solvedProblemData$.subscribe((problem: Problem | null) => {
      if (problem) {
        this.Problem = problem;
        this.ProblemId = problem.ProblemId;
      }
    });

    this.ms.updateProbSol$.subscribe((update: UpdatePS | null) => {
      if (update) {
        this.updatePs = update;
      }
    });

    this.checkToSetUpdate();
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

  checkToSetUpdate() {
    if (this.updatePs) {
      this.solutionForm.patchValue({
        Description: this.updatePs?.SolutionUpdate?.Description || '',
        Steps: this.updatePs?.SolutionUpdate?.Steps || '',
        CodeSamples: this.updatePs?.SolutionUpdate?.CodeSamples || '',
        VideoLink: this.updatePs?.SolutionUpdate?.VideoLink || ''
      });

      this.imagePreviewUrls = this.updatePs?.SolutionUpdate?.ImagePath?.split(', ') || [];
      this.mainPreviewImage = this.imagePreviewUrls.length > 0 ? this.imagePreviewUrls[0] : null;
      this.Problem = this.updatePs?.ProblemUpdate || null;
    }
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

    if (this.imagePreviewUrls.length > 0) {
      this.mainPreviewImage = this.imagePreviewUrls[0];
    } else {
      this.mainPreviewImage = null;
    }
  }

  onSubmit() {
    if (this.solutionForm.valid) {
      let solution: SolutionDto = {
        ... this.solutionForm.value,
        ImagePath: this.imagePreviewUrls.join(', ')
      }

      if (this.updatePs) {
        this.ss.updateSolution(this.updatePs.SolutionUpdate.SolutionId, solution).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showAlert(SuccessType.Success, response.message as string);
              this.ms.clearUpdateProbSol();
              this.onCancel();
            } else {
              this.ns.showAlert(SuccessType.Warning, response.error as string);
            }
          },
          error: (error) => {
            this.ns.showAlert(SuccessType.Error, error.error.error as string);
          }
        });
      } else {
        this.ss.createSolution(this.ProblemId, solution).subscribe({
          next: (response) => {
            if (response.success) {
              this.ns.showAlert(SuccessType.Success, response.message as string);
              this.onCancel();
            } else {
              this.ns.showAlert(SuccessType.Warning, response.error as string);
            }
          },
          error: (error) => {
            this.ns.showAlert(SuccessType.Error, error.error.error as string);
          }
        });
      }
      
    } else {
      this.markFormGroupTouched(this.solutionForm);
    }
  }

  onCancel() {
    this.solutionForm.reset();
    this.imagePreviewUrls = [];
    this.mainPreviewImage = null;
    this.ms.clearSolvedProblemData();
    history.back();
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
