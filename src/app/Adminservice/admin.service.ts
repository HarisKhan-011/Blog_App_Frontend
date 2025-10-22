import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = 'https://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  // 🧑‍💻 USERS MANAGEMENT
  getUsers(): Observable<any> {
    return this.http.get(`${this.api}/users`, { headers: this.headers() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-user/${id}`, { headers: this.headers() });
  }

  // 📝 POSTS MANAGEMENT
  getPosts(): Observable<any> {
    return this.http.get(`${this.api}/posts`, { headers: this.headers() });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-post/${id}`, { headers: this.headers() });
  }

  // 💬 COMMENTS MANAGEMENT
  getComments(): Observable<any> {
    return this.http.get(`${this.api}/comments`, { headers: this.headers() });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-comment/${id}`, { headers: this.headers() });
  }

  // 👍 POST LIKES MANAGEMENT
  getPostLikes(): Observable<any> {
    return this.http.get(`${this.api}/post-likes`, { headers: this.headers() });
  }

  deletePostLike(likeId: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-post-like/${likeId}`, { headers: this.headers() });
  }

  // 💬 COMMENT LIKES MANAGEMENT
  getCommentLikes(): Observable<any> {
    return this.http.get(`${this.api}/comment-likes`, { headers: this.headers() });
  }

  deleteCommentLike(likeId: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-comment-like/${likeId}`, { headers: this.headers() });
  }

  // ⚠️ REPORTS MANAGEMENT
  getReports(): Observable<any> {
    return this.http.get(`${this.api}/reports`, { headers: this.headers() });
  }

  deleteReport(reportId: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-report/${reportId}`, { headers: this.headers() });
  }

  // 💡 SUGGESTIONS MANAGEMENT
  getSuggestions(): Observable<any> {
    return this.http.get(`${this.api}/suggestions`, { headers: this.headers() });
  }

  deleteSuggestion(id: number): Observable<any> {
    return this.http.delete(`${this.api}/delete-suggestion/${id}`, { headers: this.headers() });
  }
 setUserRole(userId: number, newRole: string) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token || ''}`,
    'Content-Type': 'application/json'
  });

  // send the plain string as body
  return this.http.put(
    `https://localhost:5000/api/admin/set-role/${userId}`,
    JSON.stringify(newRole),
    { headers }
  );
}

}
