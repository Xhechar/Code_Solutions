import { Component, OnInit } from '@angular/core';
import { User, Badge } from '../../../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  // Dummy data for users
  private users: User[] = [
    {
      UserId: 'user-001',
      FullName: 'John Doe',
      Username: 'johndoe',
      Email: 'john.doe@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-01-15'),
      Badge: Badge.Expert,
      PreviousBadge: Badge.Intermediate,
      ProblemsCount: 15,
      Role: 'User',
      IsSolver: true,
      Comments: [],
      Solutions: Array(12).fill(null).map((_, i) => ({
        SolutionId: `sol-${i}`,
        Description: `Solution ${i}`,
        Steps: 'Step 1, Step 2, Step 3',
        CodeSamples: 'console.log("Hello World")',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        ProblemId: `prob-${i}`,
        UserId: 'user-001',
        editing: false
      }))
    },
    {
      UserId: 'user-002',
      FullName: 'Jane Smith',
      Username: 'janesmith',
      Email: 'jane.smith@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-02-20'),
      Badge: Badge.Intermediate,
      PreviousBadge: Badge.Beginner,
      ProblemsCount: 8,
      Role: 'Admin',
      IsSolver: false,
      Problems: Array(8).fill(null).map((_, i) => ({
        ProblemId: `prob-${i}`,
        Title: `Problem ${i}`,
        Description: `Description for problem ${i}`,
        DateCreated: new Date(),
        StackId: `stack-${i % 3}`,
        CategoryId: `cat-${i % 4}`,
        IsApproved: true,
        UserId: 'user-002',
        Reproducibility: true
      }))
    },
    {
      UserId: 'user-003',
      FullName: 'Robert Johnson',
      Username: 'robjohnson',
      Email: 'robert.johnson@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      IsDeleted: true,
      Notified: false,
      IsWelcomed: true,
      DateCreated: new Date('2023-03-05'),
      Badge: Badge.Admin,
      PreviousBadge: Badge.Expert,
      ProblemsCount: 0,
      Role: 'User',
      IsSolver: false
    },
    {
      UserId: 'user-004',
      FullName: 'Maria Garcia',
      Username: 'mariagarcia',
      Email: 'maria.garcia@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-04-12'),
      Badge: Badge.Beginner,
      PreviousBadge: Badge.Beginner,
      ProblemsCount: 3,
      Role: 'User',
      IsSolver: true,
      Solutions: Array(5).fill(null).map((_, i) => ({
        SolutionId: `sol-${i}`,
        Description: `Solution ${i}`,
        Steps: 'Step 1, Step 2, Step 3',
        CodeSamples: 'console.log("Hello World")',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        ProblemId: `prob-${i}`,
        UserId: 'user-004',
        editing: false
      }))
    },
    {
      UserId: 'user-005',
      FullName: 'David Chen',
      Username: 'davidchen',
      Email: 'david.chen@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-05-18'),
      Badge: Badge.Expert,
      PreviousBadge: Badge.Intermediate,
      ProblemsCount: 10,
      Role: 'User',
      IsSolver: true
    },
    {
      UserId: 'user-006',
      FullName: 'Sarah Wilson',
      Username: 'sarahw',
      Email: 'sarah.wilson@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
      IsDeleted: false,
      Notified: false,
      IsWelcomed: true,
      DateCreated: new Date('2023-06-25'),
      Badge: Badge.Intermediate,
      PreviousBadge: Badge.Beginner,
      ProblemsCount: 6,
      Role: 'Admin',
      IsSolver: false
    },
    {
      UserId: 'user-007',
      FullName: 'Michael Brown',
      Username: 'mikebrown',
      Email: 'michael.brown@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/men/7.jpg',
      IsDeleted: true,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-07-30'),
      Badge: Badge.Beginner,
      PreviousBadge: Badge.Beginner,
      ProblemsCount: 2,
      Role: 'User',
      IsSolver: true
    },
    {
      UserId: 'user-008',
      FullName: 'Emily Davis',
      Username: 'emilyd',
      Email: 'emily.davis@example.com',
      Password: 'hashed_password',
      ProfileImage: 'https://randomuser.me/api/portraits/women/8.jpg',
      IsDeleted: false,
      Notified: true,
      IsWelcomed: true,
      DateCreated: new Date('2023-08-15'),
      Badge: Badge.Expert,
      PreviousBadge: Badge.Expert,
      ProblemsCount: 20,
      Role: 'User',
      IsSolver: true
    }
  ];

  private selectedUserIds: string[] = [];
  private currentFilter: string = 'all';
  private currentPage: number = 1;
  private itemsPerPage: number = 5;

  ngOnInit(): void {
    this.initializeEventListeners();
    this.renderUsers();
    this.updateStats();
  }

  private initializeEventListeners(): void {
    // Search input
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchInput?.addEventListener('input', () => this.handleSearch(searchInput.value));

    // Filter buttons
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filter = target.getAttribute('data-filter') || 'all';
        this.setActiveFilter(filter);
      });
    });

    // Select all checkbox
    const selectAll = document.getElementById('selectAll') as HTMLInputElement;
    selectAll?.addEventListener('change', () => this.handleSelectAll(selectAll.checked));

    // Bulk action button
    const bulkActionBtn = document.getElementById('bulkActionBtn');
    bulkActionBtn?.addEventListener('click', () => this.handleBulkAction());

    // Filter menu toggle
    const filterBtn = document.querySelector('.filter-btn');
    filterBtn?.addEventListener('click', () => this.toggleFilterMenu());

    // Apply filters button
    const applyFiltersBtn = document.querySelector('.btn-apply');
    applyFiltersBtn?.addEventListener('click', () => this.applyFilters());

    // Clear filters button
    const clearFiltersBtn = document.querySelector('.btn-clear');
    clearFiltersBtn?.addEventListener('click', () => this.clearFilters());

    // Pagination
    document.querySelectorAll('.page-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.hasAttribute('disabled')) {
          if (target.textContent && !isNaN(parseInt(target.textContent))) {
            this.currentPage = parseInt(target.textContent);
          } else if (target.querySelector('i.fa-angle-left')) {
            this.currentPage = Math.max(1, this.currentPage - 1);
          } else if (target.querySelector('i.fa-angle-right')) {
            this.currentPage++;
          } else if (target.querySelector('i.fa-angle-double-left')) {
            this.currentPage = 1;
          } else if (target.querySelector('i.fa-angle-double-right')) {
            this.currentPage = Math.ceil(this.getFilteredUsers().length / this.itemsPerPage);
          }
          this.renderUsers();
        }
      });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(button => {
      button.addEventListener('click', () => this.closeModals());
    });

    // Modal backdrops
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => this.closeModals());
    });

    // Confirmation modal buttons
    const cancelBtn = document.querySelector('.btn-cancel');
    cancelBtn?.addEventListener('click', () => this.closeModals());

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn?.addEventListener('click', () => this.handleConfirmAction());
  }

  private handleSearch(searchText: string): void {
    this.currentPage = 1;
    this.renderUsers();
  }

  private handleSelectAll(isChecked: boolean): void {
    const checkboxes = document.querySelectorAll('.user-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
      this.handleUserSelection(checkbox.value, isChecked);
    });
  }

  private handleUserSelection(userId: string, isSelected: boolean): void {
    if (isSelected) {
      if (!this.selectedUserIds.includes(userId)) {
        this.selectedUserIds.push(userId);
      }
    } else {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    }
    
    const bulkActions = document.querySelector('.bulk-actions');
    if (this.selectedUserIds.length > 0) {
      bulkActions?.classList.remove('hidden');
    } else {
      bulkActions?.classList.add('hidden');
    }
    
    const selectAll = document.getElementById('selectAll') as HTMLInputElement;
    const checkboxes = document.querySelectorAll('.user-checkbox') as NodeListOf<HTMLInputElement>;
    selectAll.checked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
  }

  private handleBulkAction(): void {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    
    if (confirmationTitle && confirmationMessage && confirmationModal) {
      confirmationTitle.textContent = 'Confirm Deactivation';
      confirmationMessage.textContent = `Are you sure you want to deactivate ${this.selectedUserIds.length} selected user(s)?`;
      confirmationModal.classList.add('show');
    }
  }

  private handleConfirmAction(): void {
    this.users = this.users.map(user => {
      if (this.selectedUserIds.includes(user.UserId)) {
        return { ...user, IsDeleted: true };
      }
      return user;
    });
    
    this.selectedUserIds = [];
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'Users have been deactivated successfully', 'success');
  }

  private toggleFilterMenu(): void {
    const filterMenu = document.querySelector('.filter-menu');
    filterMenu?.classList.toggle('show');
  }

  private applyFilters(): void {
    this.currentPage = 1;
    this.renderUsers();
    this.toggleFilterMenu();
  }

  private clearFilters(): void {
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    filterCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    const dateInputs = document.querySelectorAll('.filter-group input[type="date"]') as NodeListOf<HTMLInputElement>;
    dateInputs.forEach(input => {
      input.value = '';
    });
    
    this.currentPage = 1;
    this.renderUsers();
  }

  private setActiveFilter(filter: string): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
      if (tab.getAttribute('data-filter') === filter) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    this.renderUsers();
  }

  private getFilteredUsers(): User[] {
    const searchText = (document.getElementById('searchInput') as HTMLInputElement)?.value?.toLowerCase() || '';
    
    return this.users.filter(user => {
      const matchesSearch = searchText === '' || 
        user.Username.toLowerCase().includes(searchText) ||
        user.Email.toLowerCase().includes(searchText) ||
        user.FullName.toLowerCase().includes(searchText);
      
      const matchesFilter = 
        this.currentFilter === 'all' || 
        (this.currentFilter === 'active' && !user.IsDeleted) ||
        (this.currentFilter === 'deleted' && user.IsDeleted);
      
      return matchesSearch && matchesFilter;
    });
  }

  private renderUsers(): void {
    const filteredUsers = this.getFilteredUsers();
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody) return;
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    paginatedUsers.forEach(user => {
      const row = document.createElement('tr');
      row.className = user.IsDeleted ? 'deleted-user' : '';
      
      const checkboxCell = document.createElement('td');
      checkboxCell.innerHTML = `
        <label class="checkbox-container">
          <input type="checkbox" class="user-checkbox" value="${user.UserId}" ${this.selectedUserIds.includes(user.UserId) ? 'checked' : ''}>
          <span class="checkmark"></span>
        </label>
      `;
      
      const userCell = document.createElement('td');
      userCell.className = 'user-cell';
      userCell.innerHTML = `
        <div class="user-info">
          <div class="user-avatar" data-user-id="${user.UserId}">
            <img src="${user.ProfileImage}" alt="${user.Username}">
          </div>
          <div class="user-name">
            <p>${user.FullName}</p>
            <span>@${user.Username}</span>
          </div>
        </div>
      `;
      
      const emailCell = document.createElement('td');
      emailCell.textContent = user.Email;
      
      const badgeCell = document.createElement('td');
      badgeCell.innerHTML = `<span class="badge badge-${user.Badge.toLowerCase()}">${user.Badge}</span>`;
      
      const roleCell = document.createElement('td');
      roleCell.innerHTML = `<span class="role role-${user.Role.toLowerCase()}">${user.Role}</span>`;
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(user.DateCreated).toLocaleDateString();
      
      const problemsCell = document.createElement('td');
      problemsCell.textContent = user.ProblemsCount.toString();
      
      const solutionsCell = document.createElement('td');
      solutionsCell.textContent = user.Solutions?.length?.toString() || '0';
      
      const statusCell = document.createElement('td');
      statusCell.innerHTML = `<span class="status status-${user.IsDeleted ? 'inactive' : 'active'}">${user.IsDeleted ? 'Inactive' : 'Active'}</span>`;
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'actions-cell';
      actionsCell.innerHTML = `
        <div class="actions-wrapper">
          <button class="action-btn edit-btn" data-user-id="${user.UserId}" data-tooltip="Edit User">
            <i class="fa fa-edit"></i>
          </button>
          <button class="action-btn ${user.IsDeleted ? 'activate-btn' : 'deactivate-btn'}" data-user-id="${user.UserId}" 
            data-tooltip="${user.IsDeleted ? 'Activate User' : 'Deactivate User'}">
            <i class="fa ${user.IsDeleted ? 'fa-user-check' : 'fa-user-slash'}"></i>
          </button>
          <button class="action-btn ${user.Role === 'Admin' ? 'remove-admin-btn' : 'make-admin-btn'}" data-user-id="${user.UserId}" 
            data-tooltip="${user.Role === 'Admin' ? 'Remove Admin' : 'Make Admin'}">
            <i class="fa ${user.Role === 'Admin' ? 'fa-user-minus' : 'fa-user-shield'}"></i>
          </button>
          <button class="action-btn delete-btn" data-user-id="${user.UserId}" data-tooltip="Delete User">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      `;
      
      row.appendChild(checkboxCell);
      row.appendChild(userCell);
      row.appendChild(emailCell);
      row.appendChild(badgeCell);
      row.appendChild(roleCell);
      row.appendChild(dateCell);
      row.appendChild(problemsCell);
      row.appendChild(solutionsCell);
      row.appendChild(statusCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
    
    this.updatePagination(filteredUsers.length);
    this.addEventListenersToTableElements();
  }

  private addEventListenersToTableElements(): void {
    const userCheckboxes = document.querySelectorAll('.user-checkbox');
    userCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.handleUserSelection(target.value, target.checked);
      });
    });
    
    const userAvatars = document.querySelectorAll('.user-avatar');
    userAvatars.forEach(avatar => {
      avatar.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const userId = target.getAttribute('data-user-id');
        if (userId) {
          this.showUserDetails(userId);
        }
      });
    });
    
    document.querySelectorAll('.action-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const userId = target.getAttribute('data-user-id');
        
        if (userId) {
          if (target.classList.contains('edit-btn')) {
            this.editUser(userId);
          } else if (target.classList.contains('deactivate-btn')) {
            this.deactivateUser(userId);
          } else if (target.classList.contains('activate-btn')) {
            this.activateUser(userId);
          } else if (target.classList.contains('make-admin-btn')) {
            this.makeAdmin(userId);
          } else if (target.classList.contains('remove-admin-btn')) {
            this.removeAdmin(userId);
          } else if (target.classList.contains('delete-btn')) {
            this.deleteUser(userId);
          }
        }
      });
    });
  }

  private updatePagination(totalItems: number): void {
    const totalPages = Math.max(1, Math.ceil(totalItems / this.itemsPerPage));
    const pagination = document.querySelector('.pagination');
    
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    const firstPageBtn = document.createElement('button');
    firstPageBtn.className = `page-btn ${this.currentPage <= 1 ? 'disabled' : ''}`;
    firstPageBtn.innerHTML = '<i class="fa fa-angle-double-left"></i>';
    pagination.appendChild(firstPageBtn);
    
    const prevPageBtn = document.createElement('button');
    prevPageBtn.className = `page-btn ${this.currentPage <= 1 ? 'disabled' : ''}`;
    prevPageBtn.innerHTML = '<i class="fa fa-angle-left"></i>';
    pagination.appendChild(prevPageBtn);
    
    const maxVisiblePages = 3;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
      pageBtn.textContent = i.toString();
      pagination.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
      const dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '...';
      pagination.appendChild(dots);
      
      const lastPageBtn = document.createElement('button');
      lastPageBtn.className = 'page-btn';
      lastPageBtn.textContent = totalPages.toString();
      pagination.appendChild(lastPageBtn);
    }
    
    const nextPageBtn = document.createElement('button');
    nextPageBtn.className = `page-btn ${this.currentPage >= totalPages ? 'disabled' : ''}`;
    nextPageBtn.innerHTML = '<i class="fa fa-angle-right"></i>';
    pagination.appendChild(nextPageBtn);
    
    const lastPageBtn = document.createElement('button');
    lastPageBtn.className = `page-btn ${this.currentPage >= totalPages ? 'disabled' : ''}`;
    lastPageBtn.innerHTML = '<i class="fa fa-angle-double-right"></i>';
    pagination.appendChild(lastPageBtn);
    
    this.addEventListenersToPaginationButtons();
  }

  private addEventListenersToPaginationButtons(): void {
    document.querySelectorAll('.pagination .page-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        
        if (target.classList.contains('disabled')) return;
        
        if (target.querySelector('i.fa-angle-double-left')) {
          this.currentPage = 1;
        } else if (target.querySelector('i.fa-angle-left')) {
          this.currentPage = Math.max(1, this.currentPage - 1);
        } else if (target.querySelector('i.fa-angle-right')) {
          const totalPages = Math.ceil(this.getFilteredUsers().length / this.itemsPerPage);
          this.currentPage = Math.min(totalPages, this.currentPage + 1);
        } else if (target.querySelector('i.fa-angle-double-right')) {
          this.currentPage = Math.ceil(this.getFilteredUsers().length / this.itemsPerPage);
        } else if (target.textContent) {
          this.currentPage = parseInt(target.textContent);
        }
        
        this.renderUsers();
      });
    });
  }

  private showUserDetails(userId: string): void {
    const user = this.users.find(u => u.UserId === userId);
    const modalUserDetails = document.getElementById('modalUserDetails');
    const userDetailsModal = document.getElementById('userDetailsModal');
    
    if (!user || !modalUserDetails || !userDetailsModal) return;
    
    modalUserDetails.innerHTML = `
      <div class="user-details-container">
        <div class="user-details-header">
          <div class="user-avatar-large">
            <img src="${user.ProfileImage}" alt="${user.Username}">
          </div>
          <div class="user-info-large">
            <h3>${user.FullName}</h3>
            <p>@${user.Username}</p>
            <p>${user.Email}</p>
          </div>
        </div>
        
        <div class="user-details-body">
          <div class="user-detail-item">
            <span class="detail-label">Role:</span>
            <span class="detail-value">${user.Role}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Badge:</span>
            <span class="badge badge-${user.Badge.toLowerCase()}">${user.Badge}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Previous Badge:</span>
            <span class="badge badge-${user.PreviousBadge.toLowerCase()}">${user.PreviousBadge}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Status:</span>
            <span class="status status-${user.IsDeleted ? 'inactive' : 'active'}">${user.IsDeleted ? 'Inactive' : 'Active'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Date Joined:</span>
            <span class="detail-value">${new Date(user.DateCreated).toLocaleDateString()}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Problems Created:</span>
            <span class="detail-value">${user.ProblemsCount}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Solutions Provided:</span>
            <span class="detail-value">${user.Solutions?.length || 0}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Is Solver:</span>
            <span class="detail-value">${user.IsSolver ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div class="user-details-stats">
          <h4>User Statistics</h4>
          <div class="user-stats-grid">
            <div class="user-stat-item">
              <span class="stat-number">${user.Comments?.length || 0}</span>
              <span class="stat-label">Comments</span>
            </div>
            <div class="user-stat-item">
              <span class="stat-number">${user.Favourites?.length || 0}</span>
              <span class="stat-label">Favorites</span>
            </div>
            <div class="user-stat-item">
              <span class="stat-number">${user.Histories?.length || 0}</span>
              <span class="stat-label">Views</span>
            </div>
          </div>
        </div>
        
        <div class="user-actions">
          <button class="btn-edit" data-user-id="${user.UserId}">
            <i class="fa fa-edit"></i> Edit
          </button>
          <button class="btn-${user.IsDeleted ? 'activate' : 'deactivate'}" data-user-id="${user.UserId}">
            <i class="fa ${user.IsDeleted ? 'fa-user-check' : 'fa-user-slash'}"></i> ${user.IsDeleted ? 'Activate' : 'Deactivate'}
          </button>
          <button class="btn-${user.Role === 'Admin' ? 'remove-admin' : 'make-admin'}" data-user-id="${user.UserId}">
            <i class="fa ${user.Role === 'Admin' ? 'fa-user-minus' : 'fa-user-shield'}"></i> ${user.Role === 'Admin' ? 'Remove Admin' : 'Make Admin'}
          </button>
          <button class="btn-delete" data-user-id="${user.UserId}">
            <i class="fa fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
    
    userDetailsModal.classList.add('show');
    this.addEventListenersToModalButtons();
  }

  private addEventListenersToModalButtons(): void {
    const editBtn = document.querySelector('.user-actions .btn-edit');
    editBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.editUser(userId);
    });

    const deactivateBtn = document.querySelector('.user-actions .btn-deactivate');
    deactivateBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.deactivateUser(userId);
    });

    const activateBtn = document.querySelector('.user-actions .btn-activate');
    activateBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.activateUser(userId);
    });

    const makeAdminBtn = document.querySelector('.user-actions .btn-make-admin');
    makeAdminBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.makeAdmin(userId);
    });

    const removeAdminBtn = document.querySelector('.user-actions .btn-remove-admin');
    removeAdminBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.removeAdmin(userId);
    });

    const deleteBtn = document.querySelector('.user-actions .btn-delete');
    deleteBtn?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const userId = target.getAttribute('data-user-id');
      if (userId) this.deleteUser(userId);
    });
  }

  private editUser(userId: string): void {
    const user = this.users.find(u => u.UserId === userId);
    if (user) {
      console.log(`Editing user: ${userId}`); // Placeholder for edit logic
      this.showToast('Info', `Edit user ${user.FullName} (not implemented)`, 'warning');
    }
  }

  private deactivateUser(userId: string): void {
    this.users = this.users.map(user => 
      user.UserId === userId ? { ...user, IsDeleted: true } : user
    );
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'User deactivated successfully', 'success');
  }

  private activateUser(userId: string): void {
    this.users = this.users.map(user => 
      user.UserId === userId ? { ...user, IsDeleted: false } : user
    );
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'User activated successfully', 'success');
  }

  private makeAdmin(userId: string): void {
    this.users = this.users.map(user => 
      user.UserId === userId ? { ...user, Role: 'Admin' } : user
    );
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'User promoted to admin', 'success');
  }

  private removeAdmin(userId: string): void {
    this.users = this.users.map(user => 
      user.UserId === userId ? { ...user, Role: 'User' } : user
    );
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'Admin role removed', 'success');
  }

  private deleteUser(userId: string): void {
    this.users = this.users.filter(user => user.UserId !== userId);
    this.renderUsers();
    this.updateStats();
    this.closeModals();
    this.showToast('Success', 'User deleted successfully', 'success');
  }

  private updateStats(): void {
    const totalUsers = this.users.length;
    const newUsers = this.users.filter(u => !u.IsDeleted && (new Date().getTime() - u.DateCreated.getTime()) / (1000 * 3600 * 24) <= 30).length;
    const deletedUsers = this.users.filter(u => u.IsDeleted).length;
    const admins = this.users.filter(u => u.Role === 'Admin').length;

    const totalUsersStat = document.querySelector('.stat-card:nth-child(1) .stat-number');
    const newUsersStat = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const deletedUsersStat = document.querySelector('.stat-card:nth-child(3) .stat-number');
    const adminsStat = document.querySelector('.stat-card:nth-child(4) .stat-number');

    if (totalUsersStat) totalUsersStat.textContent = totalUsers.toString();
    if (newUsersStat) newUsersStat.textContent = newUsers.toString();
    if (deletedUsersStat) deletedUsersStat.textContent = deletedUsers.toString();
    if (adminsStat) adminsStat.textContent = admins.toString();
  }

  private closeModals(): void {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
  }

  private showToast(title: string, message: string, type: 'success' | 'error' | 'warning'): void {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i>
      </div>
      <div class="toast-message">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
      <button class="toast-close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      toast.remove();
    });
  }
}
