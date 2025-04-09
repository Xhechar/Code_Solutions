import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Problem } from '../../interfaces/solutions.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private isVisible = new BehaviorSubject<boolean>(false);
  isVisible$: Observable<boolean> = this.isVisible.asObservable();

  private updateProblemData = new BehaviorSubject<Problem | null>(null);
  updateProblemData$: Observable<Problem | null> = this.updateProblemData.asObservable();

  private updateSolutionData = new BehaviorSubject<Problem | null>(null);
  updateSolutionData$: Observable<Problem | null> = this.updateSolutionData.asObservable();

  constructor() { }

  setUpdateProblemData(problem: Problem) {
    this.updateProblemData.next(problem);
  }

  clearUpdateProblemData() {
    this.updateProblemData.next(null);
  }

  showModal() {
    this.isVisible.next(true);
  }

  hideModal() {
    this.isVisible.next(false);
  }

  setUpdateSolutionData(solution: Problem) {
    this.updateSolutionData.next(solution);
  }
  clearUpdateSolutionData() {
    this.updateSolutionData.next(null);
  }

}
