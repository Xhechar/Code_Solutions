import { Injectable } from '@angular/core';
import { Alert } from '../../interfaces/solutions.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  private alert = new BehaviorSubject<Alert | null>(null);

  alert$: Observable<Alert | null> = this.alert.asObservable();

  showAlert(alert: Alert) {
    this.alert.next(alert);
    setTimeout(() => this.alert.next(null), 5000);
  }
}
