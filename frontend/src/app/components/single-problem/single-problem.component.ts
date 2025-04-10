import { Component, OnInit } from '@angular/core';
import { Badge, Problem, Solution, Comment, SuccessType } from '../../interfaces/solutions.interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProblemService } from '../../services/problem.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-single-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './single-problem.component.html',
  styleUrl: './single-problem.component.css'
})
export class SingleProblemComponent implements OnInit {
  problem!: Problem;
  relatedProblems!: Problem[];
  newComment: string = '';
  priorityDots: number[] = [1, 2, 3, 4, 5];
  isFavorited: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private ps: ProblemService,
    private ns: NotificationsService,
    private fs: FavouriteService
  ) { }

  ngOnInit(): void {
    const problemId = this.route.snapshot.paramMap.get('ProblemId');
    if (problemId) {
      this.loadProblem(problemId);
    }
  }

  loadProblem(problemId: string): void {
    this.ps.getSingleProblem(problemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.problem = response.problem as Problem;
          this.getRelatedProblems();
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error?.error || 'Failed to load problem');
      }
    });
  }

  getRelatedProblems() {
    this.ps.getApprovedProblems().subscribe({
      next: (response) => {
        if (response.success) {
          this.relatedProblems = (response.problems as Problem[]).filter(p => p.ProblemId !== this.problem.ProblemId && p.Category === this.problem.Category);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
        return [];
      }
    });
  }

  toggleFavorite(ProblemId: string): void {
    this.fs.addFavourite(ProblemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.isFavorited = !this.isFavorited;
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

  shareProblem(): void {
    navigator.clipboard.writeText(window.location.href);
    this.ns.showAlert(SuccessType.Success, 'Problem link copied to clipboard!');
  }

  getBadgeName(badge: Badge): string {
    return Badge[badge];
  }

  getTags(tagsString: string): string[] {
    return tagsString ? tagsString.split(',') : [];
  }

  getExcerpt(text: string, maxChars: number = 100): string {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '...';
  }

  formatSteps(steps: string): string {
    if (!steps) return '';
    const list = steps.split('\n').map(step => `<li>${step}</li>`).join('');
    return `<ol>${list}</ol>`;
  }

  formatCode(code: string): string {
    if (!code) return '';
    return code;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openAddSolutionModal(): void {
    // Implement modal functionality
    console.log('Opening add solution modal');
  }

  openImageModal(imageUrl: string): void {
    // Implement image modal functionality
    console.log('Opening image modal for:', imageUrl);
  }

  submitComment(): void {
    if (!this.newComment?.trim()) return;

    // In a real app, call a service to save the comment
    const newComment: Comment = {
      CommentId: `c${((this.problem.Comments as Comment[])).length + 1}`,
      Content: this.newComment,
      DatePosted: new Date(),
      UserId: 'u999', // Current user ID
      ProblemId: this.problem.ProblemId,
      User: {
        UserId: 'u999',
        FullName: 'Current User',
        Username: 'currentuser',
        Email: 'current@example.com',
        Password: 'hashed_password',
        ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2024-01-01'),
        Badge: Badge.Intermediate,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 15,
        Role: 'user',
        IsSolver: true
      }
    };

    ((this.problem.Comments) as Comment[]).push(newComment);
    this.newComment = '';
  }

  voteSolution(solution: Solution, type: 'up' | 'down'): void {
    // In a real app, call a service to save the vote
    console.log(`Voting ${type} for solution:`, solution.SolutionId);
    // This would typically update a votes property on the solution
  }

  hasVoted(solution: Solution, type: 'up' | 'down'): boolean {
    // In a real app, check if the current user has voted
    return false;
  }

  getVoteCount(solution: Solution, type: 'up' | 'down'): number {
    // In a real app, get the vote count from the solution
    return type === 'up' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 3);
  }
}
