import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private isVisible = new BehaviorSubject<boolean>(false);

  isVisible$: Observable<boolean> = this.isVisible.asObservable();

  constructor() { }

  showModal() {
    this.isVisible.next(true);
  }

  hideModal() {
    this.isVisible.next(false);
  }

}
