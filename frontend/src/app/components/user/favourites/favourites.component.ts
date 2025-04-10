import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category, Favourite, Problem, SuccessType } from '../../../interfaces/solutions.interfaces';
import { FavouriteService } from '../../../services/favourite.service'; // Hypothetical service, adjust path
import { NotificationsService } from '../../../services/modifiers/notifications.service'; // Adjust path

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  favorites: Favourite[] = [];
  filteredFavorites: Favourite[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  today = new Date();

  // For remove modal
  showRemoveModal: boolean = false;
  favoriteToRemove: Favourite | null = null;

  constructor(
    private router: Router,
    private favouriteService: FavouriteService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favouriteService.getFavouritesByUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.favorites = response.favourites as Favourite[];
          this.applyFilters();
          this.calculateTotalPages();
        } else {
          this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.notificationsService.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  applyFilters(): void {
    let result = this.favorites;

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(favorite =>
        favorite.Problem?.Title.toLowerCase().includes(searchLower) ||
        favorite.Problem?.Description.toLowerCase().includes(searchLower) ||
        (favorite.Problem?.ErrorCode && favorite.Problem?.ErrorCode.toLowerCase().includes(searchLower)) ||
        (favorite.Problem?.Category?.Name.toLowerCase().includes(searchLower))
      );
    }

    if (this.activeFilter === 'solved') {
      result = result.filter(favorite => this.isSolved(favorite.Problem!));
    } else if (this.activeFilter === 'unsolved') {
      result = result.filter(favorite => !this.isSolved(favorite.Problem!));
    }

    this.filteredFavorites = result;
    this.calculateTotalPages();
    this.currentPage = 1; // Reset to first page when filters change
  }

  isSolved(problem: Problem): boolean {
    if (!problem) return false;
    if (problem.Solutions === undefined) return false;
    return problem.Solutions !== undefined && problem.Solutions.length > 0;
  }

  hasSolutions(problem: Problem | undefined): boolean {
    if (!problem) return false;
    if (problem.Solutions === undefined) return false;
    return problem.Solutions !== undefined && problem.Solutions.length > 0;
  }

  getDifficultyLabel(level?: number): string {
    switch (level) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }

  getShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 120 ? `${description.substring(0, 120)}...` : description;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredFavorites.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  getCurrentPageItems(): Favourite[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFavorites.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterFavorites();
  }

  filterFavorites(): void {
    this.applyFilters();
  }

  confirmRemove(favorite: Favourite): void {
    this.favoriteToRemove = favorite;
    this.showRemoveModal = true;
  }

  removeFavorite(): void {
    if (this.favoriteToRemove) {
      this.favouriteService.removeFavourite(this.favoriteToRemove.FavouriteId).subscribe({
        next: (response) => {
          if (response.success) {
            this.favorites = this.favorites.filter(f => f.FavouriteId !== this.favoriteToRemove!.FavouriteId);
            this.applyFilters();
            this.showRemoveModal = false;
            this.notificationsService.showAlert(SuccessType.Success, response.message as string);
            this.favoriteToRemove = null;
          } else {
            this.notificationsService.showAlert(SuccessType.Warning, response.error as string);
            this.showRemoveModal = false;
            this.favoriteToRemove = null;
          }
        },
        error: (error) => {
          this.notificationsService.showAlert(SuccessType.Error, error.error?.error || 'Failed to remove favorite');
          this.showRemoveModal = false;
          this.favoriteToRemove = null;
        }
      });
    }
  }

  viewProblem(problem: Problem | undefined): void {
    if (!problem) return;
    this.router.navigate(['/user/single-problem', problem.ProblemId]);
  }

  viewSolutions(problem: Problem | undefined): void {
    this.viewProblem(problem);
  }

  getCategoryCounts(): { top: { name: string, count: number } } {
    const categoryCounts: { [key: string]: number } = {};

    this.favorites.forEach(favorite => {
      const categoryName = favorite.Problem?.Category?.Name || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    let topCategory = 'None';
    let topCount = 0;

    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > topCount) {
        topCategory = category;
        topCount = count;
      }
    });

    return {
      top: {
        name: topCategory,
        count: topCount
      }
    };
  }

  getRecentCount(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.favorites.filter(_ => {
      const dateAdded = new Date();
      return dateAdded.getMonth() === currentMonth && dateAdded.getFullYear() === currentYear;
    }).length;
  }
}