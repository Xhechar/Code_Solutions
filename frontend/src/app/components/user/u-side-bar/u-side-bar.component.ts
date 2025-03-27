import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SuccessType, User } from '../../../interfaces/solutions.interfaces';
import { ModalService } from '../../../services/modifiers/modal.service';
import { UserService } from '../../../services/user.service';
import { LogoutComponent } from "../../logout/logout.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { NotificationsService } from '../../../services/modifiers/notifications.service';

interface Badge {
  id: string;
  name: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-u-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoutComponent, NotificationsComponent],
  templateUrl: './u-side-bar.component.html',
  styleUrl: './u-side-bar.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        width: '{{collapsedWidth}}px'
      }), { params: { collapsedWidth: 70 } }),
      state('expanded', style({
        width: '{{expandedWidth}}px'
      }), { params: { expandedWidth: 260 } }),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ])
  ]
})
export class USideBarComponent {
  sidebarCollapsed = false;
  logoHovered = false;
  openDropdowns: { [key: string]: boolean } = {
    contributions: false
  };
  user: User | null = null;
  screenWidth: number = window.innerWidth;

  constructor(
    private router: Router, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private ms: ModalService,
    private us: UserService,
    private ns: NotificationsService
  ) {}

  ngOnInit(): void {
    // Check screen width on init and adjust sidebar accordingly
    this.checkScreenWidth();
    
    // Simulate fetching user data from a service
    this.fetchUserData();
    
    // Add smooth hover effects to all clickable items
    this.addHoverEffects();
    
    // Add CSS class to body based on initial sidebar state
    this.updateBodyClass();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();
    this.updateBodyClass();
  }

  checkScreenWidth() {
    if (this.screenWidth <= 768) {
      this.sidebarCollapsed = true;
    } else {
      this.sidebarCollapsed = false;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.updateBodyClass();
    
    const toggleBtn = this.el.nativeElement.querySelector('.sidebar-toggler');
    this.renderer.addClass(toggleBtn, 'sidebar-toggler-animated');
    
    setTimeout(() => {
      this.renderer.removeClass(toggleBtn, 'sidebar-toggler-animated');
    }, 500);
  }
  
  updateBodyClass() {
    if (this.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed-body');
    } else {
      document.body.classList.remove('sidebar-collapsed-body');
    }
  }

  toggleLogoHover() {
    this.logoHovered = !this.logoHovered;
  }

  toggleDropdown(dropdown: string) {
    if (this.sidebarCollapsed && this.screenWidth > 768) {
      this.sidebarCollapsed = false;
      this.updateBodyClass();
      setTimeout(() => {
        this.openDropdowns[dropdown] = !this.openDropdowns[dropdown];
      }, 300);
    } else {
      this.openDropdowns[dropdown] = !this.openDropdowns[dropdown];
    }
  }

  isDropdownOpen(dropdown: string): boolean {
    return this.openDropdowns[dropdown] || false;
  }

  logout() {
    const logoutBtn = this.el.nativeElement.querySelector('.logout-btn');
    this.renderer.addClass(logoutBtn, 'logout-animation');
    
    this.ms.showModal();
  }

  private fetchUserData() {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user as User;
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }
  
  private addHoverEffects() {
    setTimeout(() => {
      const navItems = this.el.nativeElement.querySelectorAll('.sidebar-nav ul li a');
      
      navItems.forEach((item: HTMLElement) => {
        this.renderer.listen(item, 'mouseenter', () => {
          this.renderer.addClass(item, 'nav-item-hover');
        });
        
        this.renderer.listen(item, 'mouseleave', () => {
          this.renderer.removeClass(item, 'nav-item-hover');
        });
      });
    }, 100);
  }
}