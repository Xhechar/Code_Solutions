import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

interface NavItem {
  name: string;
  icon: string;
  route?: string;
  isVisible: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-a-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './a-side-bar.component.html',
  styleUrl: './a-side-bar.component.css',
  animations: [
    trigger('submenuAnimation', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0',
        padding: '0',
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ]
})
export class ASideBarComponent implements OnInit {
  isCollapsed = false;
  isMobileView = false;
  expandedMenus: string[] = [];
  currentPath = '';
  searchTerm = '';
  navItems: NavItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.setupNavItems();
    this.setActiveRouteFromUrl(this.router.url);

    // Listen for route changes
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setActiveRouteFromUrl(event.url);
      // Always collapse sidebar on route change in mobile view
      if (this.isMobileView) {
        this.isCollapsed = true;
      }
    });
  }

  setupNavItems(): void {
    // Initialize your navigation items here for search filtering
    this.navItems = [
      {
        name: 'Dashboard',
        icon: 'fa-chart-line',
        route: '/admin/dashboard',
        isVisible: true
      },
      {
        name: 'Problems',
        icon: 'fa-tasks',
        isVisible: true,
        children: [
          {
            name: 'Admin Problems',
            icon: 'fa-user-shield',
            route: '/admin/problems/admin-problems',
            isVisible: true
          },
          {
            name: 'All Problems',
            icon: 'fa-list-alt',
            route: '/admin/problems/all-problems',
            isVisible: true
          },
          {
            name: 'Approved Problems',
            icon: 'fa-check-circle',
            route: '/admin/problems/approved-problems',
            isVisible: true
          },
          {
            name: 'Pending Problems',
            icon: 'fa-clock',
            route: '/admin/problems/pending-problems',
            isVisible: true
          },
          {
            name: 'User Problems',
            icon: 'fa-user-edit',
            route: '/admin/problems/users-problems',
            isVisible: true
          }
        ]
      },
      {
        name: 'Project Structure',
        icon: 'fa-sitemap',
        isVisible: true,
        children: [
          {
            name: 'All Structures',
            icon: 'fa-folder-tree',
            route: '/admin/project-structure/all-project-structures',
            isVisible: true
          },
          {
            name: 'Preview',
            icon: 'fa-eye',
            route: '/admin/project-structure/preview',
            isVisible: true
          },
          {
            name: 'Structure Guides',
            icon: 'fa-book',
            route: '/admin/project-structure/structure-guides',
            isVisible: true
          }
        ]
      },
      {
        name: 'Solutions',
        icon: 'fa-lightbulb',
        route: '/admin/solutions',
        isVisible: true
      },
      {
        name: 'Tech Tools',
        icon: 'fa-tools',
        isVisible: true,
        children: [
          {
            name: 'Categories',
            icon: 'fa-layer-group',
            route: '/admin/tech-tools/categories',
            isVisible: true
          },
          {
            name: 'Stacks',
            icon: 'fa-cubes',
            route: '/admin/tech-tools/stacks',
            isVisible: true
          }
        ]
      },
      {
        name: 'Users',
        icon: 'fa-users',
        isVisible: true,
        children: [
          {
            name: 'All Users',
            icon: 'fa-user-friends',
            route: '/admin/users/all-users',
            isVisible: true
          },
          {
            name: 'Deleted Users',
            icon: 'fa-user-slash',
            route: '/admin/users/deleted-users',
            isVisible: true
          }
        ]
      },
      {
        name: 'Comments',
        icon: 'fa-comments',
        route: '/admin/comments',
        isVisible: true
      }
    ];
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    const wasMobileView = this.isMobileView;
    this.isMobileView = window.innerWidth < 992;
    
    // Only auto-collapse when CHANGING to mobile view
    if (!wasMobileView && this.isMobileView) {
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
      // Don't navigate on submenu toggle
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.isCollapsed && this.isMobileView) {
      // On mobile when collapsed, expand the sidebar first
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
      // Desktop: Allow multiple expanded menus
      // Mobile: Only one expanded menu at a time
      if (this.isMobileView) {
        this.expandedMenus = [menuName];
      } else {
        this.expandedMenus.push(menuName);
      }
    }
  }

  setActiveRouteFromUrl(url: string): void {
    this.currentPath = url;
    
    // Auto-expand parent menu if a child route is active
    const parentMenus = [
      { path: '/admin/problems', name: 'problems' },
      { path: '/admin/project-structure', name: 'project-structure' },
      { path: '/admin/tech-tools', name: 'tech-tools' },
      { path: '/admin/users', name: 'users' }
    ];
    
    // Reset expanded menus if mobile to avoid multiple open submenus
    if (this.isMobileView) {
      this.expandedMenus = [];
    }
    
    // Check if any parent path is in the current URL and expand it
    parentMenus.forEach(parent => {
      // Only expand if it's a child route, not the parent route exactly
      if (url.includes(parent.path) && url !== parent.path && !this.expandedMenus.includes(parent.name)) {
        this.expandedMenus.push(parent.name);
      }
    });
  }
  
  isSubmenuActive(menuName: string): boolean {
    // This now only returns true for the parent when we're exactly on the parent route
    // not when we're on a child route
    switch(menuName) {
      case 'problems':
        return this.currentPath === '/admin/problems';
      case 'project-structure':
        return this.currentPath === '/admin/project-structure';
      case 'tech-tools':
        return this.currentPath === '/admin/tech-tools';
      case 'users':
        return this.currentPath === '/admin/users';
      default:
        return false;
    }
  }
  
  // Check if we're on a child route of a parent
  isParentOfActiveRoute(menuName: string): boolean {
    switch(menuName) {
      case 'problems':
        return this.currentPath.includes('/admin/problems/');
      case 'project-structure':
        return this.currentPath.includes('/admin/project-structure/');
      case 'tech-tools':
        return this.currentPath.includes('/admin/tech-tools/');
      case 'users':
        return this.currentPath.includes('/admin/users/');
      default:
        return false;
    }
  }
  
  ensureMenuExpanded(menuName: string): void {
    if (!this.expandedMenus.includes(menuName)) {
      this.expandedMenus.push(menuName);
    }
  }
  
  filterNavItems(): void {
    if (!this.searchTerm) {
      // Reset all items to visible
      this.resetNavItemsVisibility();
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    
    // Filter main nav items
    this.navItems.forEach(item => {
      // Check if main item matches
      const mainItemMatches = item.name.toLowerCase().includes(searchTermLower);
      
      // If has children, check each child
      if (item.children) {
        let anyChildMatches = false;
        
        item.children.forEach(child => {
          // Check if child matches search
          const childMatches = child.name.toLowerCase().includes(searchTermLower);
          child.isVisible = childMatches;
          
          if (childMatches) {
            anyChildMatches = true;
          }
        });
        
        // Main item is visible if it matches OR if any child matches
        item.isVisible = mainItemMatches || anyChildMatches;
        
        // If main item matches but no children match, show all children
        if (mainItemMatches && !anyChildMatches) {
          item.children.forEach(child => {
            child.isVisible = true;
          });
        }
      } else {
        // Simple item without children
        item.isVisible = mainItemMatches;
      }
    });
    
    // Auto expand menus that have matching children
    this.navItems.forEach(item => {
      if (item.children && item.isVisible) {
        const hasVisibleChildren = item.children.some(child => child.isVisible);
        if (hasVisibleChildren && !this.expandedMenus.includes(item.name.toLowerCase().replace(' ', '-'))) {
          this.expandedMenus.push(item.name.toLowerCase().replace(' ', '-'));
        }
      }
    });
  }
  
  resetNavItemsVisibility(): void {
    this.navItems.forEach(item => {
      item.isVisible = true;
      if (item.children) {
        item.children.forEach(child => {
          child.isVisible = true;
        });
      }
    });
  }
}