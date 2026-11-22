
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { AuthService } from '../services/auth';
import { RegisterRequest } from '../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.registerForm = this.fb.group({

      fullName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
      ]]

    });

  }

  onRegister(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request = this.registerForm.value as RegisterRequest;

    this.authService.register(request).subscribe({

      next: (response) => {
        console.log('Registration Successful!');
        console.log('Server Response:', response);

        alert(response.message);

        this.registerForm.reset();
      },

      error: (error) => {
        console.error('Registration Failed:', error);

        if (error.status === 409) {
          alert('This email is already registered.');
        }
        else {
          alert('Registration failed. Please try again.');
        }
      }

    });

  }

}
