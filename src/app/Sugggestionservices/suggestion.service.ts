import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  private apiUrl = 'https://localhost:5000/api/suggestion';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // your JWT storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  addSuggestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data, { headers: this.authHeaders() });
  }

  replyToSuggestion(parentId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reply/${parentId}`, data, { headers: this.authHeaders() });
  }

  getSuggestionsForPost(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/post/${postId}`);
  }

  // A "received" endpoint — backend must implement GET /api/suggestion/received
  getReceivedSuggestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/received`, { headers: this.authHeaders() });
  }

  getMySuggestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my`, { headers: this.authHeaders() });
  }

  acceptSuggestion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${id}`, {}, { headers: this.authHeaders() });
  }

  rejectSuggestion(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${id}`, {}, { headers: this.authHeaders() });
  }

  deleteSuggestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }
}
