import { Component, OnInit } from '@angular/core';
import { ModerationService } from '../../Moderationservice/moderation.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reported-posts',
  templateUrl: './reported-posts.component.html',
  styleUrls: ['./reported-posts.component.css'],
  standalone:true,
  imports:[CommonModule]
})
export class ReportedPostsComponent implements OnInit {
  reportedPosts: any[] = [];
  loading = true;

  constructor(private moderationService: ModerationService) {}

  ngOnInit(): void {
    this.loadReportedPosts();
  }

  loadReportedPosts() {
    this.loading = true;
    this.moderationService.getReported().subscribe({
      next: (res) => {
        this.reportedPosts = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch reported posts', err);
        this.loading = false;
      }
    });
  }

  deletePost(id: number) {
    if (confirm('🗑️ Delete this post?')) {
      this.moderationService.delete(id).subscribe({
        next: () => {
          alert('Post deleted.');
          this.loadReportedPosts();
        },
        error: (err) => console.error(err)
      });
    }
  }

  resolveReport(reportId: number, action: string, note?: string) {
    this.moderationService.resolveReport(reportId, action, note).subscribe({
      next: () => {
        alert('Report resolved.');
        this.loadReportedPosts();
      },
      error: (err) => console.error(err)
    });
  }
}
