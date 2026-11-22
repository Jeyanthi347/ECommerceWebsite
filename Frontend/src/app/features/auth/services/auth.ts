
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7173/api/Auth';

  constructor(private http: HttpClient) { }

  // Customer Registration
  register(request: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      request
    );
  }

  // Customer Login
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  // Get Logged-in Customer Profile
  getProfile(): Observable<{
    userId: string;
    fullName: string;
    email: string;
    role: string;
  }> {
    return this.http.get<{
      userId: string;
      fullName: string;
      email: string;
      role: string;
    }>(`${this.apiUrl}/profile`);
  }
}