import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProjectStructure, Stack, SuccessType } from '../../../interfaces/solutions.interfaces';
import { ProjectStructureService } from '../../../services/project-structure.service';
import { StackService } from '../../../services/stack.service';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from '../../../services/modifiers/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-ps',
  standalone: true,
  imports: [NotificationsComponent, CommonModule, FormsModule],
  templateUrl: './user-ps.component.html',
  styleUrl: './user-ps.component.css'
})
export class UserPSComponent implements OnInit, OnDestroy {
  // Data properties
  projectStructures: ProjectStructure[] = [];
  filteredProjects: ProjectStructure[] = [];
  availableStacks: Stack[] = [];
  favoriteProjects: Set<string> = new Set();
  
  // UI state
  isLoading: boolean = true;
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  stackFilter: string = '';
  sortBy: string = 'newest';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  
  // RxJS
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private projectService: ProjectStructureService,
    private stackService: StackService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private ns: NotificationsService
  ) {}

  ngOnInit(): void {
    // Apply query parameters if available
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['stack']) this.stackFilter = params['stack'];
      if (params['sort']) this.sortBy = params['sort'];
      if (params['page']) this.currentPage = +params['page'];
      if (params['view']) this.viewMode = params['view'] as 'grid' | 'list';
      if (params['search']) this.searchTerm = params['search'];
    });

    // Load data
    this.loadStacks();
    this.loadProjectStructures();
    this.loadFavorites();
    
    // Setup search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.filterProjects();
      this.updateQueryParams();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateBack(): void {
    this.location.back();
  }

  loadProjectStructures(): void {
    this.isLoading = true;
    this.projectService.getAllProjectStructures()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.success) {
            this.projectStructures = response.projects as ProjectStructure[];
            this.filteredProjects = [...this.projectStructures];
            this.totalPages = Math.ceil(this.projectStructures.length / this.itemsPerPage);
            this.isLoading = false;
            this.filterProjects();
          } else {
            // this.ns.showAlert(SuccessType.Warning, response.error as string);
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
          this.isLoading = false;
        }
      });
  }

  loadStacks(): void {
    this.stackService.getAllStacks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.success) {
            this.availableStacks = response.stacks as Stack[];
          }
          else {
            // this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
  }

  loadFavorites(): void {
    //
  }

  refreshProjects(): void {
    this.loadProjectStructures();
  }

  filterProjects(): void {
    // Apply filters
    let filtered = this.projectStructures;
    
    // Stack filter
    if (this.stackFilter) {
      filtered = filtered.filter(project => project.StackId === this.stackFilter);
    }
    
    // Search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.Title.toLowerCase().includes(searchLower) || 
        project.Description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (this.sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.LastUpdated).getTime() - new Date(a.LastUpdated).getTime()
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          new Date(a.LastUpdated).getTime() - new Date(b.LastUpdated).getTime()
        );
        break;
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => 
          a.Title.localeCompare(b.Title)
        );
        break;
      case 'guides':
        filtered = [...filtered].sort((a, b) => 
          (b.PSG?.length || 0) - (a.PSG?.length || 0)
        );
        break;
      case 'problems':
        filtered = [...filtered].sort((a, b) => 
          this.getRelatedProblemsCount(b) - this.getRelatedProblemsCount(a)
        );
        break;
    }
    
    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProjects = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.stackFilter = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.filterProjects();
    this.updateQueryParams();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.updateQueryParams();
  }

  viewProjectStructure(projectId: string): void {
    this.router.navigate(['/user/single-project-structure', projectId]);
  }

  toggleFavorite(projectId: string, event: Event): void {
    //
  }

  isProjectFavorited(projectId: string): boolean {
    return this.favoriteProjects.has(projectId);
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    this.filterProjects();
    this.updateQueryParams();
    
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    
    // Show max 5 page numbers
    let startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);
    
    // Adjust start page if needed
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Helper methods
  getStackIcon(stackId: string): string {
    const iconMap: { [key: string]: string } = {
      'react': 'bx bxl-react',
      'angular': 'bx bxl-angular',
      'vue': 'bx bxl-vuejs',
      'node': 'bx bxl-nodejs',
      'python': 'bx bxl-python',
      'java': 'bx bxl-java',
      'dotnet': 'bx bxl-c-plus-plus',
      'php': 'bx bxl-php',
      'default': 'bx bx-code-block'
    };
    
    const stack = this.availableStacks.find(s => s.StackId === stackId);
    if (!stack) return iconMap['default'];
    
    const stackNameLower = stack.Name.toLowerCase();
    
    // Find matching icon
    for (const [key, icon] of Object.entries(iconMap)) {
      if (stackNameLower.includes(key)) {
        return icon;
      }
    }
    
    return iconMap['default'];
  }

  getStackClass(stackId: string): string {
    const stack = this.availableStacks.find(s => s.StackId === stackId);
    if (!stack) return '';
    
    const stackNameLower = stack.Name.toLowerCase();
    
    // Find matching class
    if (stackNameLower.includes('react')) return 'stack-react';
    if (stackNameLower.includes('angular')) return 'stack-angular';
    if (stackNameLower.includes('vue')) return 'stack-vue';
    if (stackNameLower.includes('node')) return 'stack-node';
    if (stackNameLower.includes('python')) return 'stack-python';
    if (stackNameLower.includes('java')) return 'stack-java';
    if (stackNameLower.includes('dotnet') || stackNameLower.includes('.net')) return 'stack-dotnet';
    if (stackNameLower.includes('php')) return 'stack-php';
    
    return '';
  }

  getStackName(stackId: string): string {
    const stack = this.availableStacks.find(s => s.StackId === stackId);
    return stack ? stack.Name : 'Unknown Stack';
  }

  getStackVersion(stackId: string): string | null {
    const stack = this.availableStacks.find(s => s.StackId === stackId);
    return stack && stack.Version ? stack.Version : null;
  }

  getRelatedProblemsCount(project: ProjectStructure): number {
    if (!project.PSG || project.PSG.length === 0) return 0;
    
    // Count unique problem IDs across all PSGs
    const problemIds = new Set<string>();
    
    project.PSG.forEach(psg => {
      if (psg.RelatedProblems) {
        psg.RelatedProblems.forEach(problem => {
          problemIds.add(problem.ProblemId);
        });
      }
    });
    
    return problemIds.size;
  }

  getRelatedSolutionsCount(project: ProjectStructure): number {
    if (!project.PSG || project.PSG.length === 0) return 0;
    
    // Count unique solution IDs across all PSGs
    const solutionIds = new Set<string>();
    
    project.PSG.forEach(psg => {
      if (psg.RelatedSolutions) {
        psg.RelatedSolutions.forEach(solution => {
          solutionIds.add(solution.SolutionId);
        });
      }
    });
    
    return solutionIds.size;
  }

  getProjectComplexity(project: ProjectStructure): string {
    // Calculate complexity based on number of guides and related problems
    const guidesCount = project.PSG?.length || 0;
    const problemsCount = this.getRelatedProblemsCount(project);
    
    const total = guidesCount + problemsCount;
    
    if (total >= 15) return 'Advanced';
    if (total >= 8) return 'Intermediate';
    return 'Beginner';
  }

  isNewProject(project: ProjectStructure): boolean {
    // Project is new if created within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return new Date(project.DateCreated) > sevenDaysAgo;
  }

  // Update URL query parameters when filters change
  private updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.stackFilter) queryParams.stack = this.stackFilter;
    if (this.sortBy !== 'newest') queryParams.sort = this.sortBy;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    if (this.viewMode === 'list') queryParams.view = this.viewMode;
    if (this.searchTerm) queryParams.search = this.searchTerm;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}