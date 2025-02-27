import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-mail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify-mail.component.html',
  styleUrl: './verify-mail.component.css'
})
export class VerifyMailComponent {
  userEmail: string = '';

  onSubmit() {
    if (this.userEmail) {
      // Handle form submission - e.g., send verification code
      console.log('Sending verification code to:', this.userEmail);
      // Call your verification service here
    }
  }
}
