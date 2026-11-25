
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private apiUrl = 'https://localhost:7173/api/Admin';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/dashboard-stats`
    );
  }
}
