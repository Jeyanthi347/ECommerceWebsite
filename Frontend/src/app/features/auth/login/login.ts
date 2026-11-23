
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth';
import { LoginRequest } from '../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  onLogin(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request = this.loginForm.value as LoginRequest;

    this.authService.login(request).subscribe({

      next: (response) => {

        sessionStorage.setItem('accessToken', response.accessToken);

        sessionStorage.setItem(
          'userRoles',
          JSON.stringify(response.roles)
        );

        sessionStorage.setItem('userName', response.fullName);

        alert('Login successful! Welcome ' + response.fullName);

        // Role-based navigation
        if (response.roles.includes('Admin')) {

          this.router.navigate(['/admin/products']);

        }
        else if (response.roles.includes('Customer')) {

          this.router.navigate(['/products']);

        }
        else {

          alert('Your account does not have a valid role.');
          sessionStorage.clear();
          this.router.navigate(['/login']);

        }

      },

      error: (error) => {

        console.error('Login Failed:', error);

        if (error.status === 401) {
          alert('Invalid email or password.');
        }
        else {
          alert('Something went wrong. Please try again.');
        }

      }

    });

  }

}
