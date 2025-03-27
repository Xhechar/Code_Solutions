import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stack } from '../../../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-stacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    // Simulated initial stacks - replace with actual data fetching
    this.stacks = [
      {
        StackId: 'stack_001',
        Name: 'MERN Stack',
        Description: 'Modern web development stack using MongoDB, Express, React, and Node.js',
        Version: '1.0.0',
        ProjectStructures: [
          {
            ProjectId: '',
            Title: '',
            Description: '',
            StackId: '',
            DateCreated: new Date(),
            LastUpdated: new Date()
          },
          {
            ProjectId: '',
            Title: '',
            Description: '',
            StackId: '',
            DateCreated: new Date(),
            LastUpdated: new Date()
          }
        ]
      },
      {
        StackId: 'stack_002',
        Name: 'Django Stack',
        Description: 'Python web framework stack with PostgreSQL and Django REST framework',
        Version: '3.2.0',
        ProjectStructures: [
          {
            ProjectId: '',
            Title: '',
            Description: '',
            StackId: '',
            DateCreated: new Date(),
            LastUpdated: new Date()
          },
          {
            ProjectId: '',
            Title: '',
            Description: '',
            StackId: '',
            DateCreated: new Date(),
            LastUpdated: new Date()
          }
        ]
      }
    ];

    this.totalStructures = this.stacks.reduce((sum, stack) => sum + (stack.ProjectStructures?.length || 0), 0)
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
      // Update existing stack
      const index = this.stacks.findIndex(s => s.StackId === this.currentStack.StackId);
      if (index !== -1) {
        this.stacks[index] = { ...this.currentStack };
      }
    } else {
      // Create new stack
      this.currentStack.StackId = 'stack_' + Math.random().toString(36).substr(2, 9);
      this.stacks.push({ ...this.currentStack });
    }

    this.closeModal();
  }

  deleteStack(stackId: string): void {
    this.stacks = this.stacks.filter(stack => stack.StackId !== stackId);
  }
}