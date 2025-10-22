export interface Post {
  id: number;
  postTitle: string;
  postContent: string;
  postCategory: string;
  createdate: string;        // ✅ exact match with backend
  authorEmail: string;       // ✅ add this
  likes: PostLike[];              // ✅ add likes
  attachments: any[];        // ✅ add attachments support
  comments: Comment[];           // ✅ keep comments
}

export interface PostLike {
  id: number;
  postId: number;
  userEmail: string;
  createdAt: string; // Dates are usually strings from JSON
}

export interface Comment {
  commentId: number;
  commentText: string;
  commentDate: string;
  postId: number;
  authorEmail: string;
   replies?: Comment[];
     likesCount?: number;
  isLikedByUser?: boolean;
}

export interface AddCommentRequest {
  commentText: string;
}

