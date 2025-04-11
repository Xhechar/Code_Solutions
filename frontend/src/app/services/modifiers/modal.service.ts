import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Problem, UpdatePS } from '../../interfaces/solutions.interfaces';

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

  private solvedProblemData = new BehaviorSubject<Problem | null>(null);
  solvedProblemData$: Observable<Problem | null> = this.solvedProblemData.asObservable();

  private updateProbSol = new BehaviorSubject<UpdatePS | null>(null);
  updateProbSol$: Observable<UpdatePS | null> = this.updateProbSol.asObservable();

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

  setSolvedProblemData(problem: Problem) {
    this.solvedProblemData.next(problem);
  }
  clearSolvedProblemData() {
    this.solvedProblemData.next(null);
  }

  setUpdateProbSol(update: UpdatePS) {
    this.updateProbSol.next(update);
  }
  clearUpdateProbSol() {
    this.updateProbSol.next(null);
  }

}
