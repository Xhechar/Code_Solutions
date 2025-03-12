import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Stack {
  StackId: string;
  Name: string;
  Description: string;
  Version: string;
  Problems?: any[];
  ProjectStructures?: ProjectStructure[];
}

export interface ProjectStructure {
  PSG: any;
  ProjectId: string;
  DateCreated: Date;
  LastUpdated: Date;
  id?: string;
  name: string;
}

@Component({
  selector: 'app-stacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stacks.component.html',
  styleUrl: './stacks.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class StacksComponent {
  @Output() stackCreated = new EventEmitter<Stack>();

  isModalOpen = false;

  stack: Stack = {
    StackId: '', // Will be generated on the server
    Name: '',
    Description: '',
    Version: '',
    ProjectStructures: [],
  };

  projectStructures: ProjectStructure[] = [];

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal(event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      // Only close if clicking directly on the overlay, not its children
      if (!target.classList.contains('modal-overlay')) {
        return;
      }
    }

    this.isModalOpen = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  addStructure(): void {
    this.projectStructures.push();
  }

  removeStructure(index: number): void {
    this.projectStructures.splice(index, 1);
  }

  resetForm(): void {
    this.stack = {
      StackId: '',
      Name: '',
      Description: '',
      Version: '',
      ProjectStructures: [],
    };
    this.projectStructures = [];
  }

  onSubmit(): void {

    // Generate a random ID for demo purposes
    this.stack.StackId = 'stack_' + Math.random().toString(36).substr(2, 9);

    console.log('Stack creation submitted:', this.stack);

    // Emit the created stack
    this.stackCreated.emit({ ...this.stack });

    // For demo purposes, show success message
    alert('Stack created successfully!');

    this.resetForm();
    this.closeModal();
  }
}
