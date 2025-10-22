import { Component, OnInit } from '@angular/core';
import { ModerationService } from '../../Moderationservice/moderation.service';
import { CommonModule } from '@angular/common';
ModerationService
@Component({
  selector: 'app-pending-posts',
  templateUrl: './pending-posts.component.html',
  styleUrls: ['./pending-posts.component.css'],
  standalone:true,
  imports:[CommonModule]
})
export class PendingPostsComponent implements OnInit {
  pendingPosts: any[] = [];
  loading = true;

  constructor(private moderationService: ModerationService) {}

  ngOnInit(): void {
    this.loadPendingPosts();
  }

  loadPendingPosts() {
    this.loading = true;
    this.moderationService.getPending().subscribe({
      next: (res) => {
        this.pendingPosts = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch pending posts', err);
        this.loading = false;
      }
    });
  }

  approvePost(id: number) {
    if (confirm('✅ Approve this post?')) {
      this.moderationService.approve(id).subscribe({
        next: () => {
          alert('Post approved!');
          this.loadPendingPosts();
        },
        error: (err) => console.error(err)
      });
    }
  }

  unpublishPost(id: number) {
    if (confirm('❌ Reject this post?')) {
      this.moderationService.unpublish(id).subscribe({
        next: () => {
          alert('Post rejected/unpublished.');
          this.pendingPosts = this.pendingPosts.filter(p => p.id !== id);
          this.loadPendingPosts();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
