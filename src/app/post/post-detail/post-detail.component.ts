import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../Postservice/post.service.interceptor';
import { Post } from '../../Model/Post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../Model/Post';
import { CommentService } from '../../Commentservice/comment.interceptor';
import { SuggestionService } from '../../Sugggestionservices/suggestion.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post = {
    id: 0,
    postTitle: '',
    postContent: '',
    postCategory: '',
    createdate: '',
    authorEmail: '',
    attachments: [],
    likes: [],
    comments: []
  };
reportReasons = ['Spam', 'HateSpeech', 'Violence', 'FakeNews', 'SexualContent', 'Other'];
  loading = true;
  newComment = '';
  likesCount = 0;
  userLiked = false;
  isLoggedIn = false;

  showReportBox = false;
  reportReason = '';
  reportDetails = '';
  reportMessage = '';

  // for commentfeatures
  commentPage = 1;
pageSize = 5;
totalComments = 0;
loadingComments = false;
comments: Comment[] = [];
  replyTextMap: Record<number, string> = {};
  showReplyBox: Record<number, boolean> = {};
editingCommentId: number | null = null;
userEmail: string | null = null;
replyText: string = '';
replyingCommentId: number | null = null; 
//for suggestions
suggestionText = '';
postId = 0;
suggestions: any[] = [];
showSuggestionBox = false;
  constructor(private route: ActivatedRoute, private postService: PostService,private commentService:CommentService,private suggestionService:SuggestionService) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
    this.isLoggedIn = !!localStorage.getItem('JwtToken');
    this.userEmail=localStorage.getItem("email");
  }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postId=id;
    this.postService.get(id).subscribe({
      next: res => {
         this.post = res; 
       this.post.comments = res.comments || [];
        this.post.likes = res.likes || [];
        this.likesCount = res.likes.length;
        const userEmail = localStorage.getItem('email');
        this.userLiked = res.likes.some(like => like.userEmail === userEmail);
         this.loadComments();
         this.loadSuggestions(); 
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

likePost() {
  if (!this.isLoggedIn) {
    alert('Please login to like the post.');
    return;
  }

  this.postService.toggleLike(this.post.id).subscribe({
    next: (res: any) => {
      if (res) {
        this.likesCount = res.count;
        this.userLiked = res.liked;
      }
    },
    error: err => console.error('Like failed:', err)
  });
}

//  toggleLike() {
//   this.postService.toggleLike(this.post.id).subscribe({
//     next: (res: any) => {
//       // Update UI like count
//       if (res.liked !== undefined && res.count !== undefined) {
//         this.likesCount = res.count; // create a new property in Post interface
//       }
//     },
//     error: err => console.error('Like failed:', err)
//   });

addComment() {
  if (!this.newComment.trim()) return;

  this.postService.addComment(this.post.id, this.newComment).subscribe({
    next: (response: any) => {
 
      // Convert backend keys (PascalCase) to Angular keys (camelCase)
      const newComment = {
        commentId: response.commentId || response.CommentId,
        commentText: response.commentText || response.CommentText,
        commentDate: response.commentDate || response.CommentDate,
        authorEmail: response.authorEmail || response.AuthorEmail,
        postId: response.postId || response.PostId
      };

      // ✅ Show comment immediately
      this.post.comments.unshift(newComment);
      this.totalComments++;
      this.newComment = ''; // Clear input after submit
    },
    error: err => console.error('Add comment failed:', err)
  });
}
//  addComment() {
//     if (!this.newComment.trim()) return;
//     if (!this.post?.id) return;

//     this.commentService.addComment(this.post.id, this.newComment).subscribe({
//       next: (response: any) => {
//         // Insert the newly created comment at top
//         this.comments.unshift(response);
//         this.totalComments++;
//         this.newComment = '';
//       },
//       error: err => console.error('Add comment failed:', err)
//     });
//   }

openReport() {
  if (!this.isLoggedIn) {
    alert('Please login to report');
    return;
  }
  this.showReportBox = true;
}
 cancelReport() {
  this.showReportBox = false;
  this.reportReason = '';
  this.reportDetails = '';
  this.reportMessage = '';
}
submitReport() {
  if (!this.reportReason) return;
  this.postService.reportPost(this.post.id, this.reportReason, this.reportDetails).subscribe({
    next: (res: any) => {
      this.reportMessage = res?.message || 'Report submitted';
      this.showReportBox = false;
      // keep message for a while or show toast
      setTimeout(() => this.reportMessage = '', 4000);
    },
    error: (err) => {
      console.error('Report failed', err);
      if (err?.status === 409) this.reportMessage = 'You already reported this post.';
      else this.reportMessage = (err?.error?.message) || 'Failed to submit report';
      setTimeout(() => this.reportMessage = '', 4000);
    }
  });
}

//for commentfeatures
  loadComments() {
    if (!this.post?.id) return;
    this.loadingComments = true;

    this.commentService.getComments(this.post.id, this.commentPage, this.pageSize).subscribe({
      next: (res: any) => {
        // backend returns { data: [...], totalCount, page, pageSize }
        const incoming: Comment[] = res.data || res;
        // Append unique comments (avoid duplicates if loadComments called repeatedly)
        for (const c of incoming) {
          if (!this.comments.some(x => x.commentId === c.commentId)) {
            this.comments.push(c);
          }
        }
        this.totalComments = res.totalCount ?? this.comments.length;
        this.loadingComments = false;
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.loadingComments = false;
      }
    });
  }

loadMoreComments() {
  if (this.comments.length < this.totalComments) {
    this.commentPage++;
    this.loadComments();
  }
}

//Likecomment
likeComment(comment: any) {
    if (!this.isLoggedIn) {
      alert('Please login to like comments.');
      return;
    }
    this.commentService.likeComment(comment.commentId).subscribe({
      next: (res: any) => {
        // Optionally update UI: toggle like flag & count (if backend returns new state)
        // For now, if backend doesn't return updated object, you could increment local like count
        comment._liked = true;
        comment._likesCount = (comment._likesCount || 0) + 1;
      },
      error: err => {
        console.error('Like failed', err);
      }
    });
  }
    unlikeComment(comment: any) {
    if (!this.isLoggedIn) {
      alert('Please login to unlike comments.');
      return;
    }
    this.commentService.unlikeComment(comment.commentId).subscribe({
      next: () => {
        comment._liked = false;
        comment._likesCount = Math.max((comment._likesCount || 1) - 1, 0);
      },
      error: err => console.error('Unlike failed', err)
    });
  }
//reply to comment 

  toggleReplyBox(commentId: number) {
    this.showReplyBox[commentId] = !this.showReplyBox[commentId];
  }

  replyToComment(parentId: number) {
  const text = (this.replyTextMap[parentId] || '').trim();
  if (!text) return;

  this.commentService.replyToComment(parentId, text, Number(this.post.id))
    .subscribe({
      next: res => {
        console.log("Reply added:", res);
        this.replyTextMap[parentId] = '';
        this.replyingCommentId = null;
        this.loadComments();
      },
      error: err => console.error(err)
    });
}
// ✅ Open comment edit mode
editComment(comment: any) {
  this.editingCommentId = comment.commentId;
  this.newComment = comment.commentText; // load comment to textbox
}

// ✅ Save edited comment
saveEditComment(comment: any) {
  if (!this.newComment.trim()) return;
  this.commentService.updateComment(comment.commentId, this.newComment).subscribe(() => {
    this.editingCommentId = null;
    this.loadComments();
  });
}

// ✅ Reply to comment
// replyToComment(comment: any) {
//   this.replyingCommentId = comment.commentId;
// }

// ✅ Fake method to avoid error if HTML still uses replyComment
replyComment(comment: any) {
  this.replyToComment(comment);
}
cancelReply() {
  this.replyingCommentId = null;
  this.replyText = '';
}
submitReply(commentId: number) {
  if (!this.replyText.trim()) return;

  this.commentService.replyToComment(commentId, this.replyText, this.post.id)
    .subscribe({
      next: res => {
        console.log("Reply saved!", res);
        this.replyText = '';
        this.replyingCommentId = null;
        this.loadComments(); // refresh list
      },
      error: err => console.error("Reply failed", err)
    });
}
toggleCommentLike(comment:Comment){
  this.commentService.toggleLike(comment.commentId).subscribe({
    next:()=>{
      if (comment.isLikedByUser) {
    comment.likesCount!--;
    comment.isLikedByUser = false;
    console.log('✅ You unliked this comment');
  } else {
    comment.likesCount = (comment.likesCount || 0) + 1;
    comment.isLikedByUser = true;
    console.log('👍 You liked this comment');
  }
    }, error: (err) => console.error('Like failed', err)
  })
}

//for suggestions 
loadSuggestions() {
  this.suggestionService.getSuggestionsForPost(this.postId).subscribe({
    next: (res) => this.suggestions = res,
    error: err => console.error('load suggestions error', err)
  });
}

openSuggestionBox() {
  this.showSuggestionBox = true;
}

cancelSuggestion() {
  this.showSuggestionBox = false;
  this.suggestionText = '';
}

submitSuggestion() {
  if (!this.suggestionText?.trim()) {
    alert('Suggestion cannot be empty');
    return;
  }

  const data = {
    suggestionText: this.suggestionText,
    postId: this.postId   // ✅ Make sure this.postId is set correctly
  };

  console.log("Sending to API:", data);  // ✅ Debug log to check postId before sending

  this.suggestionService.addSuggestion(data).subscribe({
    next: (res) => {
      alert('Suggestion submitted successfully!');
      this.suggestionText = '';
      this.loadSuggestions(); // reload list
    },
    error: (err) => {
      console.error('Failed to add suggestion:', err);
      if (err.status === 400) alert('Bad request: Missing or invalid postId.');
      else if (err.status === 401) alert('Unauthorized. Please log in.');
      else alert('Something went wrong.');
    }
  });
}

}