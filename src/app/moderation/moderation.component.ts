import { Component, OnInit } from '@angular/core';
import { ModerationService } from '../Moderationservice/moderation.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css']
})
export class ModerationComponent implements OnInit {
  tab: 'pending'|'reported' = 'pending';
  pending = [];
  reported = [];

  constructor(private mod: ModerationService) {}

  ngOnInit() {
    this.loadPending();
    this.loadReported();
  }

  loadPending() {
    this.mod.getPending().subscribe({ next: res => this.pending = res, error: e => console.error(e) });
  }

  loadReported() {
    this.mod.getReported().subscribe({ next: res => this.reported = res, error: e => console.error(e) });
  }

  approve(postId: number) {
    if (!confirm('Approve this post?')) return;
    this.mod.approve(postId).subscribe(() => this.loadPending());
  }

  unpublish(postId: number) {
    if (!confirm('Unpublish this post?')) return;
    this.mod.unpublish(postId).subscribe(() => { this.loadPending(); this.loadReported(); });
  }

  delete(postId: number) {
    if (!confirm('Delete this post permanently?')) return;
    this.mod.delete(postId).subscribe(() => { this.loadPending(); this.loadReported(); });
  }

  resolveReport(reportId: number, action: string) {
    this.mod.resolveReport(reportId, action).subscribe(()=> this.loadReported());
  }
}
