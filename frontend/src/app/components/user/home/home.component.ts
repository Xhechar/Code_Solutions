import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Problem, SuccessType } from '../../../interfaces/solutions.interfaces';
import { ProblemService } from '../../../services/problem.service';
import { NotificationsComponent } from "../../notifications/notifications.component";
import { NotificationsService } from '../../../services/modifiers/notifications.service';
import { FavouriteService } from '../../../services/favourite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  problems: Problem[] = [];
  testCount: number = 0;
  currentImageIndex: { [key: string]: number } = {};

  constructor(private problemService: ProblemService, private ns: NotificationsService, private fs: FavouriteService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProblems();
    this.testCount = this.generateTestCount();
  }

  fetchProblems(): void {
    this.problemService.getApprovedProblems().subscribe({
      next: (response) => {
        console.log(response);
        
        if (response.success) {
          this.problems = response.problems as Problem[];
          this.initializeImageIndices();
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  initializeImageIndices(): void {
    this.problems.forEach(problem => {
      if (problem.ImagePath) {
        this.currentImageIndex[problem.ProblemId] = 0;
      }
    });
  }

  generateTestCount(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  switchImage(problem: Problem, direction: 'left' | 'right'): void {
    if (!problem.ImagePath) return;
    const images = problem.ImagePath.split(', ');
    if (images.length <= 1) return;

    const currentIndex = this.currentImageIndex[problem.ProblemId];
    const totalImages = images.length;

    if (direction === 'left') {
      this.currentImageIndex[problem.ProblemId] = 
        (currentIndex - 1 + totalImages) % totalImages;
    } else {
      this.currentImageIndex[problem.ProblemId] = 
        (currentIndex + 1) % totalImages;
    }
  }

  getCurrentImage(problem: Problem): string {
    if (!problem.ImagePath) return '';
    const images = problem.ImagePath.split(', ');
    return images[this.currentImageIndex[problem.ProblemId]] || '';
  }

  addToFavourites(problemId: string): void {
    this.fs.addFavourite(problemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, 'Added to favourites');
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }

  openCommentModal(problem: Problem): void {
    console.log(`Opening comments for problem: ${problem.Title}`);
  }

  markNeedsRefinement(problemId: string): void {
    console.log(`Marked problem ${problemId} as needing refinement`);
  }

  navigateToSingleProblem(problemId: string): void {
    this.router.navigate(['/user/single-problem', problemId]);
  }

  viewTestOfDay(): void {
    console.log('Viewing test of the day');
  }

  searchError(): void {}
}