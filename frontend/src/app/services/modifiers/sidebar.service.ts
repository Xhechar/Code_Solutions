import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _sidebarCollapsed = new BehaviorSubject<boolean>(false);
  
  // Observable for components to subscribe to
  public sidebarState = this._sidebarCollapsed.asObservable();
  
  // Toggle sidebar state
  toggleSidebar(): void {
    this._sidebarCollapsed.next(!this._sidebarCollapsed.value);
  }
  
  // Set specific state
  setSidebarState(isCollapsed: boolean): void {
    this._sidebarCollapsed.next(isCollapsed);
  }
  
  // Handle window resize
  private onResize(): void {
    if (window.innerWidth < 992) {
      // Always collapse on small screens
      this._sidebarCollapsed.next(true);
    }
  }
}
