import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { User } from '../../../interfaces/solutions.interfaces';
import { UserService } from '../../../services/user.service';
import { LogoutComponent } from '../../logout/logout.component';
import { ModalService } from '../../../services/modifiers/modal.service';
import { SidebarService } from '../../../services/modifiers/sidebar.service';

@Component({
  selector: 'app-a-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, RouterLinkActive, LogoutComponent],
  templateUrl: './a-side-bar.component.html',
  styleUrl: './a-side-bar.component.css'
})
export class ASideBarComponent {
  isCollapsed = false;
  isMobileView = false;
  expandedMenus: string[] = [];
  searchTerm = '';
  show: boolean = false;

  user!: User;

  constructor(private us: UserService, private ms: ModalService, private ss: SidebarService) {}

  ngOnInit(): void {
    this.getUser();
    this.checkScreenSize();

    this.ss.sidebarState$.subscribe(res => {
      this.show = res;
    });
  }

  autoAdjustSidebar(): void {
    if (window.innerWidth < 768) {
      this.ss.toggleSidebar();
    }
  }

  getUser(): void {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user as User;
        } else {
          // console.error(response.error);
        }
      },
      error: (error) => {
        // console.error(error.error.error);
      }
    });
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

  logout(): void {
    this.ms.showModal();
  }

  filterNavItems(): void {
    // Placeholder for search functionality if needed
  }
}