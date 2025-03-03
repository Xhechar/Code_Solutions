import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ASideBarComponent } from './a-side-bar/a-side-bar.component';
import { RouterOutlet } from '@angular/router';
import { ATopBarComponent } from './a-top-bar/a-top-bar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ASideBarComponent, RouterOutlet, ATopBarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
