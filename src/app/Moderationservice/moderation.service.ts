import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModerationService {
  api = 'https://localhost:5000/api/moderation';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  getPending(page = 1): Observable<any> {
    return this.http.get(`${this.api}/pending?page=${page}`, { headers: this.headers() });
  }

  getReported(page = 1): Observable<any> {
    return this.http.get(`${this.api}/reported?page=${page}`, { headers: this.headers() });
  }

  approve(postId: number) {
    return this.http.put(`${this.api}/approve/${postId}`, {}, { headers: this.headers() });
  }

  unpublish(postId: number) {
    return this.http.put(`${this.api}/unpublish/${postId}`, {}, { headers: this.headers() });
  }

  delete(postId: number) {
    return this.http.delete(`${this.api}/delete/${postId}`, { headers: this.headers() });
  }

  resolveReport(reportId: number, action: string, note?: string) {
    return this.http.put(`${this.api}/report/resolve/${reportId}`, { action, note }, { headers: this.headers() });
  }


  
}
