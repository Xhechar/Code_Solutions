import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-a-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './a-side-bar.component.html',
  styleUrl: './a-side-bar.component.css'
})
export class ASideBarComponent {
  isCollapsed = false;
  isMobileView = false;
  expandedMenus: string[] = [];
  searchTerm = '';

  constructor() {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 992;
    
    if (this.isMobileView) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobileView) {
      this.isCollapsed = true;
    }
  }

  toggleSubmenu(menuName: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.isCollapsed && this.isMobileView) {
      this.isCollapsed = false;
      setTimeout(() => {
        this.toggleSubmenuState(menuName);
      }, 100);
    } else {
      this.toggleSubmenuState(menuName);
    }
  }

  toggleSubmenuState(menuName: string): void {
    if (this.expandedMenus.includes(menuName)) {
      this.expandedMenus = this.expandedMenus.filter(item => item !== menuName);
    } else {
      if (this.isMobileView) {
        this.expandedMenus = [menuName];
      } else {
        this.expandedMenus.push(menuName);
      }
    }
  }

  filterNavItems(): void {
    // Placeholder for search functionality if needed
  }
}