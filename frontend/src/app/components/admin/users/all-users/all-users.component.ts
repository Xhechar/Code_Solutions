import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Badge, SuccessType } from '../../../../interfaces/solutions.interfaces';
import { UserService } from '../../../../services/user.service';
import { NotificationsService } from '../../../../services/modifiers/notifications.service';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  
  totalUsers: number = 0;
  activeUsers: number = 0;
  deletedUsers: number = 0;
  adminUsers: number = 0;
  
  searchQuery: string = '';
  filterBy: string = 'name';
  sortBy: string = 'newest';
  currentFilter: string = 'all';
  showFilterDropdown: boolean = false;
  showSortDropdown: boolean = false;
  
  selectedUsers: string[] = [];
  allSelected: boolean = false;
  
  selectedUserDetails: User | null = null;
  
  constructor(
    private userService: UserService,
    private ns: NotificationsService
  ) {}
  
  ngOnInit(): void {
    this.fetchUsers();
    
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.filter-dropdown') && this.showFilterDropdown) {
        this.showFilterDropdown = false;
      }
      if (!(event.target as Element).closest('.sort-dropdown') && this.showSortDropdown) {
        this.showSortDropdown = false;
      }
    });
  }
  
  private fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.users = response.users;
          this.calculateStats();
          this.filterUsers('all');
          this.ns.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }
  
  calculateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => !user.IsDeleted).length;
    this.deletedUsers = this.users.filter(user => user.IsDeleted).length;
    this.adminUsers = this.users.filter(user => user.Role === 'Admin').length;
  }
  
  filterUsers(filterType: string): void {
    this.currentFilter = filterType;
    
    switch (filterType) {
      case 'active':
        this.filteredUsers = this.users.filter(user => !user.IsDeleted);
        break;
      case 'deleted':
        this.filteredUsers = this.users.filter(user => user.IsDeleted);
        break;
      case 'admin':
        this.filteredUsers = this.users.filter(user => user.Role === 'Admin');
        break;
      default:
        this.filteredUsers = [...this.users];
    }
    
    this.applySearch();
    this.applySort();
    this.clearSelection();
  }
  
  handleSearch(): void {
    this.applySearch();
  }
  
  applySearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    
    this.filteredUsers = this.filteredUsers.filter(user => {
      switch (this.filterBy) {
        case 'email':
          return user.Email.toLowerCase().includes(query);
        case 'badge':
          return user.Badge.toLowerCase().includes(query);
        case 'role':
          return user.Role.toLowerCase().includes(query);
        default:
          return (
            user.FullName.toLowerCase().includes(query) || 
            user.Username.toLowerCase().includes(query)
          );
      }
    });
  }
  
  handleSort(): void {
    this.applySort();
  }
  
  applySort(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredUsers.sort((a, b) => 
          new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime()
        );
        break;
      case 'oldest':
        this.filteredUsers.sort((a, b) => 
          new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime()
        );
        break;
      case 'problems':
        this.filteredUsers.sort((a, b) => b.ProblemsCount - a.ProblemsCount);
        break;
    }
  }
  
  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
    if (this.showFilterDropdown) {
      this.showSortDropdown = false;
    }
  }
  
  toggleSortDropdown(): void {
    this.showSortDropdown = !this.showSortDropdown;
    if (this.showSortDropdown) {
      this.showFilterDropdown = false;
    }
  }
  
  toggleSelectUser(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
    
    this.updateAllSelectedState();
  }
  
  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.filteredUsers.map(user => user.UserId);
    }
    
    this.allSelected = !this.allSelected;
  }
  
  updateAllSelectedState(): void {
    this.allSelected = this.filteredUsers.length > 0 && 
      this.selectedUsers.length === this.filteredUsers.length;
  }
  
  isSelected(userId: string): boolean {
    return this.selectedUsers.includes(userId);
  }
  
  clearSelection(): void {
    this.selectedUsers = [];
    this.allSelected = false;
  }
  
  bulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`)) {
      this.userService.bulkDeleteUsers(this.selectedUsers).subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.map(user => 
              this.selectedUsers.includes(user.UserId) 
                ? { ...user, IsDeleted: true } 
                : user
            );
            this.calculateStats();
            this.filterUsers(this.currentFilter);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  bulkDeactivate(): void {
    if (confirm(`Are you sure you want to deactivate ${this.selectedUsers.length} users?`)) {
      this.userService.bulkDeleteUsers(this.selectedUsers).subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.map(user => 
              this.selectedUsers.includes(user.UserId) 
                ? { ...user, IsDeleted: true } 
                : user
            );
            this.calculateStats();
            this.filterUsers(this.currentFilter);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  editUser(user: User): void {
    alert(`Edit user: ${user.FullName}`);
  }
  
  makeAdmin(user: User): void {
    if (confirm(`Are you sure you want to make ${user.FullName} an admin?`)) {
      const updatedUser = { ...user, Role: 'Admin' };
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          if (response.success) {
            this.updateUser(updatedUser);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  removeAdmin(user: User): void {
    if (confirm(`Are you sure you want to remove admin rights from ${user.FullName}?`)) {
      const updatedUser = { ...user, Role: 'User' };
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          if (response.success) {
            this.updateUser(updatedUser);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  toggleUserStatus(user: User): void {
    const action = user.IsDeleted ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${action} ${user.FullName}'s account?`)) {
      const updatedUser = { ...user, IsDeleted: !user.IsDeleted };
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          if (response.success) {
            this.updateUser(updatedUser);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.FullName}?`)) {
      this.userService.deleteUser(user.UserId).subscribe({
        next: (response) => {
          if (response.success) {
            const updatedUser = { ...user, IsDeleted: true };
            this.updateUser(updatedUser);
            this.ns.showAlert(SuccessType.Success, response.message as string);
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
  
  updateUser(updatedUser: User): void {
    this.users = this.users.map(user => 
      user.UserId === updatedUser.UserId ? updatedUser : user
    );
    
    if (this.selectedUserDetails && this.selectedUserDetails.UserId === updatedUser.UserId) {
      this.selectedUserDetails = updatedUser;
    }
    
    this.calculateStats();
    this.filterUsers(this.currentFilter);
  }
  
  showUserDetails(user: User): void {
    this.selectedUserDetails = { ...user };
  }
  
  closeUserDetails(): void {
    this.selectedUserDetails = null;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  getBadgeClass(badge: Badge): string {
    switch (badge) {
      case Badge.Expert:
        return 'badge-expert';
      case Badge.Intermediate:
        return 'badge-intermediate';
      case Badge.Beginner:
        return 'badge-beginner';
      case Badge.Admin:
        return 'badge-admin';
      default:
        return '';
    }
  }
}