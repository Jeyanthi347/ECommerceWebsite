
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    private authService: AuthService
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

      console.log('Login Successful!');
      console.log('User Details:', response);

      sessionStorage.setItem('accessToken', response.accessToken);

      alert('Login successful! Welcome ' + response.fullName);

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
