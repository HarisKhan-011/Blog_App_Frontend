import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'https://localhost:5000/api/comment';

  constructor(private http: HttpClient) {}

  // ✅ Attach Token Helper
  private authHeaders() {
    const token = localStorage.getItem('JwtToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ✅ Get Comments by Post + Pagination
  getComments(postId: number, page = 1, pageSize = 5): Observable<any> {
    return this.http.get(`${this.baseUrl}/post/${postId}?page=${page}&pageSize=${pageSize}`);
  }

  // ✅ Add Comment
  addComment(postId: number, commentText: string): Observable<any> {
    return this.http.post(this.baseUrl, { postId, commentText }, this.authHeaders());
  }

  // ✅ Reply to Comment (Fixed parameter order)
replyToComment(parentId: number, replyText: string, postId: number) {
  const body = {
    commentText: replyText,
    postId: postId
  };

  return this.http.post(`${this.baseUrl}/ReplyToComment/${parentId}`, body);
}

  // ✅ Like Comment
  likeComment(commentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/like/${commentId}`, {}, this.authHeaders());
  }

  // ✅ Unlike Comment
  unlikeComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/unlike/${commentId}`, this.authHeaders());
  }

  // ✅ Report Comment
  reportComment(commentId: number, reason: string, details?: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/report/${commentId}`,
      { reason, details },
      this.authHeaders()
    );
  }
  updateComment(commentId: number, updatedText: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/update/${commentId}`, { commentText: updatedText });
}
toggleLike(commentId: number) {
  return this.http.post(`${this.baseUrl}/like/${commentId}`, {} );
}

}
