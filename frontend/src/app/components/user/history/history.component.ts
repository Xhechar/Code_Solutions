import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { History, SuccessType } from '../../../interfaces/solutions.interfaces';
import { HistoryService } from '../../../services/history.service';
import { NotificationsService } from '../../../services/modifiers/notifications.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  // Search and Filter
  searchText: string = '';
  stackFilter: string = '';
  dateFilter: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  // Modal
  showDeleteModal: boolean = false;
  itemToDelete: History | null = null;
  isDeleteAll: boolean = false;

  // Data
  historyItems: History[] = [];
  filteredHistoryItems: History[] = [];
  expandedStates: Map<string, boolean> = new Map(); // Tracks expanded state by HistoryId

  constructor(
    private router: Router,
    private historyService: HistoryService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyService.getHistoryByUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.historyItems = response.histories as History[];
          this.historyItems.forEach(item => this.expandedStates.set(item.HistoryId, false)); // Initialize all as collapsed
          this.applyFilters();
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error?.error || 'Failed to fetch history');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.historyItems];

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(item =>
        item.Problem?.Title.toLowerCase().includes(searchLower) ||
        item.Problem?.Description.toLowerCase().includes(searchLower) ||
        (item.Problem?.ErrorCode && item.Problem.ErrorCode.toLowerCase().includes(searchLower)) ||
        item.Problem?.Stack?.Name.toLowerCase().includes(searchLower) ||
        item.Problem?.Category?.Name.toLowerCase().includes(searchLower)
      );
    }

    if (this.stackFilter) {
      filtered = filtered.filter(item =>
        item.Problem?.Stack?.Name === this.stackFilter
      );
    }

    if (this.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);

      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      filtered = filtered.filter(item => {
        const accessDate = new Date(item.AccessedAt);

        if (this.dateFilter === 'today') {
          return accessDate >= today;
        } else if (this.dateFilter === 'week') {
          return accessDate >= weekAgo;
        } else if (this.dateFilter === 'month') {
          return accessDate >= monthAgo;
        }
        return true;
      });
    }

    this.filteredHistoryItems = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredHistoryItems.length / this.itemsPerPage) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  getPageArray(): number[] {
    const pages = [];
    const maxPages = 5;

    if (this.totalPages <= maxPages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, startPage + 2);

      if (endPage === this.totalPages - 1) {
        startPage = Math.max(2, endPage - 2);
      }

      if (startPage > 2) {
        pages.push(-1); // Ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push(-2); // Ellipsis
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilters();
  }

  toggleExpand(item: History): void {
    this.filteredHistoryItems.forEach(historyItem => {
      if (historyItem.HistoryId !== item.HistoryId) {
        this.expandedStates.set(historyItem.HistoryId, false);
      }
    });
    const currentState = this.expandedStates.get(item.HistoryId) || false;
    this.expandedStates.set(item.HistoryId, !currentState);
  }

  isExpanded(item: History): boolean {
    return this.expandedStates.get(item.HistoryId) || false;
  }

  viewProblem(item: History): void {
    this.router.navigate(['/user/single-problem', item.Problem?.ProblemId]);
  }

  viewSolutions(item: History): void {
    this.viewProblem(item); // Matches your current behavior
  }

  confirmDelete(item: History): void {
    this.showDeleteModal = true;
    this.itemToDelete = item;
    this.isDeleteAll = false;
  }

  confirmClearHistory(): void {
    this.showDeleteModal = true;
    this.itemToDelete = null;
    this.isDeleteAll = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.isDeleteAll = false;
  }

  confirmDeleteAction(): void {
    if (this.isDeleteAll) {
      this.clearAllHistory();
    } else if (this.itemToDelete) {
      this.deleteHistoryItem(this.itemToDelete);
    }
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.isDeleteAll = false;
  }

  deleteHistoryItem(item: History): void {
    this.historyService.deleteSingleHistory(item.HistoryId).subscribe({
      next: (response) => {
        if (response.success) {
          this.historyItems = this.historyItems.filter(
            historyItem => historyItem.HistoryId !== item.HistoryId
          );
          this.expandedStates.delete(item.HistoryId); // Clean up state
          this.applyFilters();
          this.notificationsService.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  clearAllHistory(): void {
    this.historyService.clearHistory().subscribe({
      next: (response) => {
        if (response.success) {
          this.historyItems = [];
          this.expandedStates.clear();
          this.applyFilters();
          this.notificationsService.showAlert(SuccessType.Success, response.message as string);
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  // Stats for the header
  getTotalItems(): number {
    return this.historyItems.length;
  }

  getItemsThisWeek(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    return this.historyItems.filter(item => new Date(item.AccessedAt) >= weekAgo).length;
  }

  getItemsToday(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.historyItems.filter(item => new Date(item.AccessedAt) >= today).length;
  }
}