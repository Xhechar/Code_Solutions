import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-u-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './u-top-bar.component.html',
  styleUrl: './u-top-bar.component.css'
})
export class UTopBarComponent implements OnInit {
  isProfileMenuOpen = false;
  isCreateMenuOpen = false;
  isSidebarCollapsed = false;

  constructor() { }

  ngOnInit(): void {
    // Subscribe to sidebar state changes
    // This is a placeholder - you would implement this based on your sidebar service
    // this.sidebarService.sidebarState$.subscribe(isCollapsed => {
    //   this.isSidebarCollapsed = isCollapsed;
    // });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    // Close other menus
    if (this.isProfileMenuOpen) {
      this.isCreateMenuOpen = false;
    }
  }

  toggleCreateMenu(): void {
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
    
    // Close other menus
    if (this.isCreateMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileElement = document.querySelector('.profile-section');
    const createElement = document.querySelector('.create-button');
    
    if (profileElement && !profileElement.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }
    
    if (createElement && !createElement.contains(event.target as Node)) {
      this.isCreateMenuOpen = false;
    }
  }

  // Prevent closing when clicking inside the menu
  @HostListener('click', ['$event'])
  onComponentClick(event: Event): void {
    event.stopPropagation();
  }
}
