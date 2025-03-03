import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { USideBarComponent } from './u-side-bar/u-side-bar.component';
import { UTopBarComponent } from './u-top-bar/u-top-bar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, USideBarComponent, UTopBarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
