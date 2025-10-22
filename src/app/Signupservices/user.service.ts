import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:5000/api/signup'; // matches SignupController route

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // Get all users (Admin only endpoint you already have)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-users`, this.authHeaders());
  }

  // Update role (Admin only)
  setRole(userId: number, newRole: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/set-role/${userId}`, { newRole }, this.authHeaders());
  }
}
