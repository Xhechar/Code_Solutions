import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Badge } from '../../../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  // Data
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Stats
  totalUsers: number = 0;
  activeUsers: number = 0;
  deletedUsers: number = 0;
  adminUsers: number = 0;
  
  // Search and Filter
  searchQuery: string = '';
  filterBy: string = 'name';
  sortBy: string = 'newest';
  currentFilter: string = 'all';
  showFilterDropdown: boolean = false;
  showSortDropdown: boolean = false;
  
  // Selection
  selectedUsers: string[] = [];
  allSelected: boolean = false;
  
  // Modal
  selectedUserDetails: User | null = null;
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadUsers();
    this.calculateStats();
    this.filterUsers('all');
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.filter-dropdown') && this.showFilterDropdown) {
        this.showFilterDropdown = false;
      }
      if (!(event.target as Element).closest('.sort-dropdown') && this.showSortDropdown) {
        this.showSortDropdown = false;
      }
    });
  }
  
  // Data Loading
  loadUsers(): void {
    // Dummy data based on your interface
    this.users = [
      {
        UserId: '1',
        FullName: 'John Doe',
        Username: 'johndoe',
        Email: 'john.doe@example.com',
        Password: 'hashedpassword',
        ProfileImage: 'https://i.pravatar.cc/150?img=1',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2023-05-15'),
        Badge: Badge.Expert,
        PreviousBadge: Badge.Intermediate,
        ProblemsCount: 23,
        Role: 'Admin',
        IsSolver: true,
        Comments: [],
        Solutions: [
          { SolutionId: 's1', Description: 'Solution 1', Steps: 'Step 1, Step 2', CreatedAt: new Date(), UpdatedAt: new Date(), ProblemId: 'p1', UserId: '1', editing: false }
        ]
      },
      {
        UserId: '2',
        FullName: 'Alice Smith',
        Username: 'alicesmith',
        Email: 'alice.smith@example.com',
        Password: 'hashedpassword',
        ProfileImage: 'https://i.pravatar.cc/150?img=5',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2023-07-22'),
        Badge: Badge.Intermediate,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 7,
        Role: 'User',
        IsSolver: true,
        Comments: [],
        Solutions: []
      },
      {
        UserId: '3',
        FullName: 'Robert Johnson',
        Username: 'rjohnson',
        Email: 'robert.johnson@example.com',
        Password: 'hashedpassword',
        ProfileImage: 'https://i.pravatar.cc/150?img=3',
        IsDeleted: true,
        Notified: false,
        IsWelcomed: true,
        DateCreated: new Date('2023-03-10'),
        Badge: Badge.Beginner,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 2,
        Role: 'User',
        IsSolver: false,
        Comments: [],
      },
      {
        UserId: '4',
        FullName: 'Maria Garcia',
        Username: 'mgarcia',
        Email: 'maria.garcia@example.com',
        Password: 'hashedpassword',
        ProfileImage: '',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2023-08-05'),
        Badge: Badge.Expert,
        PreviousBadge: Badge.Intermediate,
        ProblemsCount: 15,
        Role: 'Admin',
        IsSolver: true,
        Comments: [],
      },
      {
        UserId: '5',
        FullName: 'David Chen',
        Username: 'dchen',
        Email: 'david.chen@example.com',
        Password: 'hashedpassword',
        ProfileImage: 'https://i.pravatar.cc/150?img=8',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2023-11-18'),
        Badge: Badge.Intermediate,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 9,
        Role: 'User',
        IsSolver: true,
        Comments: [],
      },
      {
        UserId: '6',
        FullName: 'Sarah Wilson',
        Username: 'swilson',
        Email: 'sarah.wilson@example.com',
        Password: 'hashedpassword',
        ProfileImage: 'https://i.pravatar.cc/150?img=9',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2023-06-30'),
        Badge: Badge.Admin,
        PreviousBadge: Badge.Expert,
        ProblemsCount: 31,
        Role: 'Admin',
        IsSolver: true,
        Comments: [],
      },
      {
        UserId: '7',
        FullName: 'James Brown',
        Username: 'jbrown',
        Email: 'james.brown@example.com',
        Password: 'hashedpassword',
        ProfileImage: '',
        IsDeleted: true,
        Notified: false,
        IsWelcomed: true,
        DateCreated: new Date('2023-02-12'),
        Badge: Badge.Beginner,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 1,
        Role: 'User',
        IsSolver: false,
        Comments: [],
      }
    ];
  }
  
  calculateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => !user.IsDeleted).length;
    this.deletedUsers = this.users.filter(user => user.IsDeleted).length;
    this.adminUsers = this.users.filter(user => user.Role === 'Admin').length;
  }
  
  // Filter and Search Functions
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
  
  // Dropdown Toggle Functions
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
  
  // User Selection Functions
  toggleSelectUser(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
    
    // Update all selected state
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
  
  // Bulk Actions
  bulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`)) {
      // In a real app, you would call a service to delete the users
      // For this example, we'll just mark them as deleted
      this.users = this.users.map(user => 
        this.selectedUsers.includes(user.UserId) 
          ? { ...user, IsDeleted: true } 
          : user
      );
      
      // Recalculate stats and reapply filters
      this.calculateStats();
      this.filterUsers(this.currentFilter);
    }
  }
  
  bulkDeactivate(): void {
    if (confirm(`Are you sure you want to deactivate ${this.selectedUsers.length} users?`)) {
      // In a real app, you would call a service to deactivate the users
      // For this example, we'll just mark them as deleted
      this.users = this.users.map(user => 
        this.selectedUsers.includes(user.UserId) 
          ? { ...user, IsDeleted: true } 
          : user
      );
      
      // Recalculate stats and reapply filters
      this.calculateStats();
      this.filterUsers(this.currentFilter);
    }
  }
  
  // Individual User Actions
  editUser(user: User): void {
    // In a real app, you would navigate to an edit user page or show a modal
    alert(`Edit user: ${user.FullName}`);
  }
  
  makeAdmin(user: User): void {
    if (confirm(`Are you sure you want to make ${user.FullName} an admin?`)) {
      // In a real app, you would call a service to update the user
      const updatedUser = { ...user, Role: 'Admin' };
      this.updateUser(updatedUser);
    }
  }
  
  removeAdmin(user: User): void {
    if (confirm(`Are you sure you want to remove admin rights from ${user.FullName}?`)) {
      // In a real app, you would call a service to update the user
      const updatedUser = { ...user, Role: 'User' };
      this.updateUser(updatedUser);
    }
  }
  
  toggleUserStatus(user: User): void {
    const action = user.IsDeleted ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${action} ${user.FullName}'s account?`)) {
      // In a real app, you would call a service to update the user
      const updatedUser = { ...user, IsDeleted: !user.IsDeleted };
      this.updateUser(updatedUser);
    }
  }
  
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.FullName}?`)) {
      // In a real app, you would call a service to delete the user
      // For this example, we'll just mark them as deleted
      const updatedUser = { ...user, IsDeleted: true };
      this.updateUser(updatedUser);
    }
  }
  
  updateUser(updatedUser: User): void {
    // Update the user in the main list
    this.users = this.users.map(user => 
      user.UserId === updatedUser.UserId ? updatedUser : user
    );
    
    // If showing user details, update those too
    if (this.selectedUserDetails && this.selectedUserDetails.UserId === updatedUser.UserId) {
      this.selectedUserDetails = updatedUser;
    }
    
    // Recalculate stats and reapply filters
    this.calculateStats();
    this.filterUsers(this.currentFilter);
  }
  
  // User Details Modal
  showUserDetails(user: User): void {
    this.selectedUserDetails = { ...user };
  }
  
  closeUserDetails(): void {
    this.selectedUserDetails = null;
  }
  
  // Helper Functions
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