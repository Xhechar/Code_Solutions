import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Badge {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  primaryBadge?: Badge;
  secondaryBadge?: Badge;
  tertiaryBadge?: Badge;
}

@Component({
  selector: 'app-u-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private el: ElementRef
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
    
    // Add animation to toggle button
    const toggleBtn = this.el.nativeElement.querySelector('.sidebar-toggler');
    this.renderer.addClass(toggleBtn, 'sidebar-toggler-animated');
    
    setTimeout(() => {
      this.renderer.removeClass(toggleBtn, 'sidebar-toggler-animated');
    }, 500);
  }
  
  updateBodyClass() {
    // Update body class
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
      // If sidebar is collapsed, expand it first before opening dropdown
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
    
    setTimeout(() => {
      // Handle logout logic
      // For example:
      // this.authService.logout().subscribe(() => {
      //   this.router.navigate(['/login']);
      // });
      
      // For now, just navigate to login
      this.router.navigate(['/login']);
    }, 800);
  }

  private fetchUserData() {
    // Simulate HTTP request to get user data
    // In a real app, you would inject a UserService and call it
    setTimeout(() => {
      this.user = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        profileImage: 'https://i.pinimg.com/236x/ce/40/b6/ce40b67b89fbba423a330ee1a6bff863.jpg',
        primaryBadge: {
          id: 'badge1',
          name: 'Gold Solver',
          description: 'Solved over 100 code problems',
          color: '#FFD700'
        },
        secondaryBadge: {
          id: 'badge2',
          name: 'Silver Contributor',
          description: 'Created over 50 solutions',
          color: '#C0C0C0'
        }
        // Note: tertiaryBadge is undefined to demonstrate the greyed out state
      };
    }, 1000);
  }
  
  private addHoverEffects() {
    // Apply advanced hover effects using Renderer2
    setTimeout(() => {
      const navItems = this.el.nativeElement.querySelectorAll('.sidebar-nav ul li a');
      
      navItems.forEach((item: HTMLElement) => {
        this.renderer.listen(item, 'mouseenter', () => {
          // Add a subtle animation class
          this.renderer.addClass(item, 'nav-item-hover');
        });
        
        this.renderer.listen(item, 'mouseleave', () => {
          this.renderer.removeClass(item, 'nav-item-hover');
        });
      });
    }, 100);
  }
}