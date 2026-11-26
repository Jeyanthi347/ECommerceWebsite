
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css'
})
export class CustomerLayoutComponent {

  userName = sessionStorage.getItem('userName') || 'Customer';

  isProfileMenuOpen = false;

  constructor(private router: Router) {}

  // Open and close profile dropdown
  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // Close dropdown after selecting an option
  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  // Logout customer
  logout(): void {

    sessionStorage.clear();

    this.isProfileMenuOpen = false;

    this.router.navigate(['/login']);
  }

}
