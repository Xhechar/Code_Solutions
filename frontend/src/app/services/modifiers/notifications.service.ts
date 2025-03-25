import { Injectable } from '@angular/core';
import { Alert, SuccessType } from '../../interfaces/solutions.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  private messageType = new BehaviorSubject<SuccessType | null>(null);
  private message = new BehaviorSubject<string | null>(null);

  messageType$: Observable<SuccessType | null> = this.messageType.asObservable();
  message$: Observable<string | null> = this.message.asObservable();

  showAlert(messageType: SuccessType, message: string) {
    this.messageType.next(messageType);
    this.message.next(message);
    setTimeout(() => {
      this.messageType.next(null);
      this.message.next(null);
    }, 4000);
  }
}
