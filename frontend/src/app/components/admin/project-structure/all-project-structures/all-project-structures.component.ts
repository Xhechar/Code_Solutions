import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ProjectStructure, Problem, Stack, PSG, SuccessType } from '../../../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../../../services/modifiers/notifications.service';
import { ProblemService } from '../../../../services/problem.service';
import { ProjectStructureService } from '../../../../services/project-structure.service';
import { StackService } from '../../../../services/stack.service';
import { PsgService } from '../../../../services/psg.service';


@Component({
  selector: 'app-all-project-structures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-project-structures.component.html',
  styleUrl: './all-project-structures.component.css',
})
export class AllProjectStructuresComponent implements OnInit {
  projectStructures: ProjectStructure[] = [];
  problems: Problem[] = [];
  stacks: Stack[] = [];

  // Selection states
  selectedProjectId: string = '';
  selectedProject: ProjectStructure | null = null;
  selectedPSG: PSG | null = null;

  // Modal states
  showNewProjectModal: boolean = false;
  showPSGFormModal: boolean = false;
  showDeleteConfirmation: boolean = false;

  // Form objects
  newProject: ProjectStructure = this.createEmptyProject();
  psgForm: PSG = this.createEmptyPSG();
  psgToDelete: PSG | null = null;
  editingPSG: boolean = false;

  // Problem selector
  showProblemSelector: boolean = false;
  problemSearchTerm: string = '';
  selectedProblems: string[] = [];

  // Image handling
  previewImages: string[] = [];
  selectedImageIndex: number = 0;
  currentImageIndex: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private projectStructureService: ProjectStructureService,
    private problemService: ProblemService,
    private stackService: StackService,
    private ns: NotificationsService,
    private psgs: PsgService
  ) {}

  ngOnInit(): void {
    this.fetchStacks();
    this.fetchProblems();
    this.fetchProjectStructures();
  }

  private fetchStacks(): void {
    this.stackService.getAllStacks().subscribe({ // Assuming getAllStacks method
      next: (response) => {
        if (response.success && response.stacks) {
          this.stacks = response.stacks;
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

  private fetchProblems(): void {
    this.problemService.getAllProblems().subscribe({
      next: (response) => {
        if (response.success && response.problems) {
          this.problems = response.problems as Problem[];
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

  private fetchProjectStructures(): void {
    this.projectStructureService.getAllProjectStructures().subscribe({ // Assuming getAllProjectStructures method
      next: (response) => {
        if (response.success && response.projectStructures) {
          this.projectStructures = response.projectStructures;
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

  createEmptyProject(): ProjectStructure {
    return {
      ProjectId: this.generateId(),
      Title: '',
      Description: '',
      StackId: '',
      DateCreated: new Date(),
      LastUpdated: new Date(),
      PSG: [],
    };
  }

  createEmptyPSG(): PSG {
    return {
      PSGId: this.generateId(),
      Title: '',
      ProjectId: '',
      PictorialGuide: '',
      TextInstructions: '',
      RelatedProblemIds: undefined
    };
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  formatInstructions(text: string): any {
    if (!text) return '';

    let formatted = text
      .replace(/# (.*?)(?:\n|$)/g, '<h2>$1</h2>')
      .replace(/## (.*?)(?:\n|$)/g, '<h3>$1</h3>')
      .replace(/### (.*?)(?:\n|$)/g, '<h4>$1</h4>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\d+\. (.*?)(?:\n|$)/gm, '<li>$1</li>')
      .replace(/^- (.*?)(?:\n|$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>');

    return this.sanitizer.bypassSecurityTrustHtml('<p>' + formatted + '</p>');
  }

  getPictorialImages(guide: PSG): string[] {
    if (!guide.PictorialGuide) return [];
    try {
      return JSON.parse(guide.PictorialGuide);
    } catch (e) {
      return [];
    }
  }

  getRelatedProblemsCount(guide: PSG): number {
    if (!guide.RelatedProblemIds) return 0;
    return guide.RelatedProblemIds.split(',').filter((id: string) => id.trim() !== '').length;
  }

  getProblemTitle(problemId: string): string {
    const problem = this.problems.find((p) => p.ProblemId === problemId);
    return problem ? problem.Title : 'Unknown Problem';
  }

  getTotalPSGs(): number {
    return this.projectStructures.reduce((total, project) => {
      return total + (project.PSG ? project.PSG.length : 0);
    }, 0);
  }

  getTotalRelatedProblems(): number {
    let uniqueProblemIds = new Set<string>();

    this.projectStructures.forEach((project) => {
      if (project.PSG) {
        project.PSG.forEach((guide) => {
          if (guide.RelatedProblemIds) {
            guide.RelatedProblemIds.split(',').forEach((id: string) => {
              if (id.trim() !== '') {
                uniqueProblemIds.add(id.trim());
              }
            });
          }
        });
      }
    });

    return uniqueProblemIds.size;
  }

  selectProject(): void {
    if (!this.selectedProjectId) {
      this.selectedProject = null;
      this.selectedPSG = null;
      return;
    }

    this.selectedProject =
      this.projectStructures.find(
        (p) => p.ProjectId === this.selectedProjectId
      ) || null;

    this.selectedPSG = null;
  }

  selectPSG(psg: PSG): void {
    this.selectedPSG = psg;
    this.currentImageIndex = 0;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  selectPreviewImage(index: number): void {
    this.selectedImageIndex = index;
  }

  openNewProjectStructureForm(): void {
    this.newProject = this.createEmptyProject();
    this.showNewProjectModal = true;
  }

  cancelNewProject(): void {
    this.showNewProjectModal = false;
  }

  createNewProject(): void {
    this.newProject.DateCreated = new Date();
    this.newProject.LastUpdated = new Date();
    this.newProject.PSG = [];

    this.projectStructureService.createProjectStructure(this.newProject).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectStructures.push();
          this.selectedProjectId = this.newProject.ProjectId;
          this.selectProject();
          this.showNewProjectModal = false;
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

  updateProjectStructure(): void {
    if (!this.selectedProject) return;

    this.selectedProject.LastUpdated = new Date();

    this.projectStructureService.updateProjectStructure(this.selectedProject.ProjectId, this.selectedProject).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.projectStructures.findIndex(
            (p) => p.ProjectId === this.selectedProject?.ProjectId
          );
          if (index !== -1) {
            this.projectStructures[index] = { ...this.selectedProject! };
            this.ns.showAlert(SuccessType.Success, response.message as string);
          }
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  openNewPSGForm(): void {
    if (!this.selectedProject) return;

    this.psgForm = this.createEmptyPSG();
    this.psgForm.ProjectId = this.selectedProject.ProjectId;
    this.editingPSG = false;
    this.selectedProblems = [];
    this.previewImages = [];
    this.selectedImageIndex = 0;
    this.showPSGFormModal = true;
  }

  openEditPSGForm(psg: PSG): void {
    this.psgForm = { ...psg };
    this.editingPSG = true;

    this.selectedProblems = psg.RelatedProblemIds
      ? psg.RelatedProblemIds.split(',').filter((id: string) => id.trim() !== '')
      : [];

    this.previewImages = this.getPictorialImages(psg);
    this.selectedImageIndex = 0;

    this.showPSGFormModal = true;
  }

  cancelPSGForm(): void {
    this.showPSGFormModal = false;
    this.showProblemSelector = false;
  }

  submitPSGForm(): void {
    this.psgForm.RelatedProblemIds = this.selectedProblems.join(',');

    if (this.previewImages.length > 0) {
      this.psgForm.PictorialGuide = JSON.stringify(this.previewImages);
    }

    if (this.editingPSG) {
      this.psgs.updatePsg(this.psgForm.PSGId, this.psgForm).subscribe({
        next: (response) => {
          if (response.success && this.selectedProject && this.selectedProject.PSG) {
            const index = this.selectedProject.PSG.findIndex(
              (p) => p.PSGId === this.psgForm.PSGId
            );
            if (index !== -1) {
              this.selectedProject.PSG[index] = { ...this.psgForm };
              if (this.selectedPSG && this.selectedPSG.PSGId === this.psgForm.PSGId) {
                this.selectedPSG = this.selectedProject.PSG[index];
              }
              this.showPSGFormModal = false;
              this.showProblemSelector = false;
              this.ns.showAlert(SuccessType.Success, response.message as string);
            }
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
    } else {
      this.psgs.createPsg(this.psgForm).subscribe({
        next: (response) => {
          if (response.success && this.selectedProject) {
            if (!this.selectedProject.PSG) {
              this.selectedProject.PSG = [];
            }
            this.selectedProject.LastUpdated = new Date();
            this.showPSGFormModal = false;
            this.showProblemSelector = false;
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
  }

  confirmDeletePSG(psg: PSG): void {
    this.psgToDelete = psg;
    this.showDeleteConfirmation = true;
  }

  cancelDeletePSG(): void {
    this.psgToDelete = null;
    this.showDeleteConfirmation = false;
  }

  deletePSG(): void {
    if (!this.psgToDelete || !this.selectedProject || !this.selectedProject.PSG) {
      this.showDeleteConfirmation = false;
      return;
    }

    this.psgs.deletePsg(this.psgToDelete.PSGId).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedProject!.PSG = this.selectedProject!.PSG!.filter(
            (p) => p.PSGId !== this.psgToDelete?.PSGId
          );
          // if (this.selectedPSG && this.selectedPSG.PSGId === this.psgToDelete.PSGId) {
          //   this.selectedPSG = null;
          // }
          this.selectedProject!.LastUpdated = new Date();
          this.showDeleteConfirmation = false;
          this.psgToDelete = null;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    Array.from(input.files).forEach((file) => {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Code_Solutions');
      formData.append('cloud_name', 'dakyiye2e');

      fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(res => {
          this.previewImages.push(res.secure_url);
          if (this.selectedImageIndex === 0 && this.previewImages.length === 1) {
            this.selectedImageIndex = 0;
          }
        })
        .catch(error => {
          this.ns.showAlert(SuccessType.Error, 'Image upload failed');
        });
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    if (this.selectedImageIndex >= this.previewImages.length) {
      this.selectedImageIndex = Math.max(0, this.previewImages.length - 1);
    }
  }

  toggleProblemSelector(): void {
    this.showProblemSelector = !this.showProblemSelector;
    this.problemSearchTerm = '';
  }

  // Placeholder methods (unchanged)
  removeProblem(_t257: string) {
    throw new Error('Method not implemented.');
  }

  filteredProblems(): any {
    throw new Error('Method not implemented.');
  }

  addProblem(arg0: any) {
    throw new Error('Method not implemented.');
  }
}