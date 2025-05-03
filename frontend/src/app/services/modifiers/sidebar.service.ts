import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$: Observable<boolean> = this.sidebarState.asObservable();

  private increaseWidth = new BehaviorSubject<boolean>(false);
  increaseWidth$: Observable<boolean> = this.increaseWidth.asObservable();

  constructor() {
    window.addEventListener('resize', () => this.onResize());
  }

  toggleIncreaseWidth(): void {
    window.innerWidth > 768
      ? this.increaseWidth.next(!this.increaseWidth.value)
      : this.increaseWidth.next(this.increaseWidth.value);
  }

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  resizeSideBar(resizer: boolean): void {
    this.sidebarState.next(resizer);
  }

  private onResize(): void {
    window.innerWidth <= 768
      ? this.resizeSideBar(true)
      : this.resizeSideBar(false);
  }
}
