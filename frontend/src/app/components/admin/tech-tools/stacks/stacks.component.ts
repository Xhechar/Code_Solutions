import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stack, StackDto, SuccessType } from '../../../../interfaces/solutions.interfaces';
import { StackService } from '../../../../services/stack.service';
import { NotificationsService } from '../../../../services/modifiers/notifications.service';
import { NotificationsComponent } from '../../../notifications/notifications.component';

@Component({
  selector: 'app-stacks',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './stacks.component.html',
  styleUrl: './stacks.component.css'
})
export class StacksComponent implements OnInit {
  stacks: Stack[] = [];
  isModalOpen = false;
  isUpdateMode = false;
  currentStack: Stack = this.initializeEmptyStack();
  totalStructures: number = 0;

  ngOnInit(): void {
    this.totalStructures = this.stacks.reduce((sum, stack) => sum + (stack.ProjectStructures?.length || 0), 0)
  }

  constructor(private ss: StackService, private ns: NotificationsService) {
    this.getStacks();
  }

  getStacks(): void{
    this.ss.getAllStacks().subscribe({
      next: (response) => {
        if (response.success) {
          this.stacks = response.stacks as Stack[];
          this.totalStructures = this.stacks.reduce((sum, stack) => sum + (stack.ProjectStructures?.length || 0), 0);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  initializeEmptyStack(): Stack {
    return {
      StackId: '',
      Name: '',
      Description: '',
      Version: '',
      ProjectStructures: []
    };
  }

  openModal(stack?: Stack): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';

    if (stack) {
      // Update mode
      this.isUpdateMode = true;
      this.currentStack = { ...stack };
    } else {
      // Create mode
      this.isUpdateMode = false;
      this.currentStack = this.initializeEmptyStack();
    }
  }

  closeModal(event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('modal-overlay')) {
        return;
      }
    }

    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  addStructure(): void {
    if (!this.currentStack.ProjectStructures) {
      this.currentStack.ProjectStructures = [];
    }
    this.currentStack.ProjectStructures.push({
      ProjectId: '',
      Title: '',
      Description: '',
      StackId: '',
      DateCreated: new Date(),
      LastUpdated: new Date()
    });
  }

  removeStructure(index: number): void {
    if (this.currentStack.ProjectStructures) {
      this.currentStack.ProjectStructures.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.isUpdateMode) {
      const stack: StackDto = {
        Name: this.currentStack.Name,
        Description: this.currentStack.Description,
        Version: this.currentStack.Version
      };

      this.ss.updateStack(this.currentStack.StackId, stack).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showAlert(SuccessType.Success, response.message as string);
            this.getStacks();
            this.currentStack = this.initializeEmptyStack();
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
    } else {
      const stack: StackDto = {
        Name: this.currentStack.Name,
        Description: this.currentStack.Description,
        Version: this.currentStack.Version
      };

      this.ss.createStack(stack).subscribe({
        next: (response) => {
          if (response.success) {
            this.ns.showAlert(SuccessType.Success, response.message as string);
            this.getStacks();
            this.currentStack = this.initializeEmptyStack();
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
    }

    this.closeModal();
  }

  deleteStack(stackId: string): void {
    this.ss.deleteStack(stackId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          this.getStacks();
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