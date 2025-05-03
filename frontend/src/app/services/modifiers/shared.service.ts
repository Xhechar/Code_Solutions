import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  static API_URL = 'https://code-solutions-backend.onrender.com/'

  constructor() { }
}
