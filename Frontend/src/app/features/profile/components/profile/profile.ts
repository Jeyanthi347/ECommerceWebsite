
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  userName = sessionStorage.getItem('userName') || 'Customer';

  userEmail = sessionStorage.getItem('userEmail') || 'Not available';

  logout(): void {

    sessionStorage.clear();

    window.location.href = '/login';

  }

}
