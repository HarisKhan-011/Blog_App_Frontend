import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../Model/Post';
import { Observable, throwError } from 'rxjs';
import { Comment } from '../Model/Post';
@Injectable({ providedIn: 'root' })
export class PostService {
  base = 'https://localhost:5000/api/postpage';

  constructor(private http: HttpClient) {}

 getApproved(page = 1, pageSize = 4, category?: string, search?: string) {
  let url = `${this.base}/approved?page=${page}&pageSize=${pageSize}`;

  if (category && category !== "All") {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  return this.http.get<any>(url);
}

list(page = 1, pageSize = 10, category?: string, search?: string) {
  let q = `${this.base}?page=${page}&pageSize=${pageSize}`;
  if (category) q += `&category=${encodeURIComponent(category)}`;
  if (search) q += `&search=${encodeURIComponent(search)}`;
  return this.http.get<any>(q);
}




   get(id:number) { 
    return this.http.get<Post>(`${this.base}/single/${id}`);  // ✅ matches backend
  }

  create(post: Post) { 
    return this.http.post<Post>(`${this.base}/create`, post);  // ✅ FIXED
  }

  // addComment(postId:number, text:string) {
  //   return this.http.post(`${this.base}/${postId}/comment`, { commentText: text });  // ✅ fixed /comment route
  // }
//  addComment(postId: number, commentText: string) {
//     const token = localStorage.getItem('JwtToken') || '';
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.post<Comment>(`${this.base}/${postId}/comment`, { commentText }, { headers });
//   }

// addComment(postId: number, commentText: string) {
//   return this.http.post<Comment>(
//     `${this.base}/${postId}/comment`,
//     { commentText }   // ✅ Must send as object
//   );
// }
addComment(postId: number, commentText: string) {
  return this.http.post(`${this.base}/${postId}/comment`, {
    commentText: commentText
  });
}
  // toggleLike(postId:number) {
  //   return this.http.post(`${this.base}/${postId}/like`, {}); // ✅ ok
  // }
 // post.service.ts

toggleLike(postId: number) {
  const token = localStorage.getItem('JwtToken');
  if (!token) {
    return throwError(() => new Error('No JWT token found'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<{ liked: boolean; count: number }>(
    `${this.base}/${postId}/like`,
    {},
    { headers }
  );
}

reportPost(postId: number, reason: string, details?: string) {
  const body = { reason, details };
  return this.http.post(`${this.base}/${postId}/report`, body);
}


  getPresign(fileName:string) {
    return this.http.post<{url:string,key:string}>(`${this.base}/attachments/presign`, { fileName });
  }
 
}
