import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Category {
  CategoryId: string;
  Name: string;
  Description: string;
  Problems?: any[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  animations: [
    trigger('modalAnimation', [
      transition('void => open', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('open => closed', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class CategoriesComponent {
  category: Category = {
    CategoryId: '',  // Will be generated on the server
    Name: '',
    Description: ''
  };
  
  isModalOpen: boolean = false;
  
  openModal(): void {
    this.isModalOpen = true;
    // Prevent scrolling of the background content
    document.body.style.overflow = 'hidden';
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    // Allow scrolling again
    document.body.style.overflow = 'auto';
    
    // Reset form
    setTimeout(() => {
      if (!this.isModalOpen) {
        this.category = {
          CategoryId: '',
          Name: '',
          Description: ''
        };
      }
    }, 300); // Wait for animation to complete
  }
  
  closeOnOverlay(event: MouseEvent): void {
    // Close modal only if the overlay itself was clicked
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }
  
  onSubmit(): void {
    // Generate a random ID for demo purposes
    this.category.CategoryId = 'category_' + Math.random().toString(36).substr(2, 9);
    
    console.log('Category creation submitted:', this.category);
    // Call your category creation service here
    
    // Close modal after successful submission
    this.closeModal();
    
    // For demo purposes, show success message
    setTimeout(() => {
      alert('Category created successfully!');
    }, 300);
  }
}
