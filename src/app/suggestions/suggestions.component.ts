import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuggestionService } from '../Sugggestionservices/suggestion.service';

interface Suggestion {
  suggestionId: number;
  suggestionText: string;
  suggestionDate: string;
  postId: number;
  authorEmail: string;
  status: string;
  replies?: Suggestion[];
}

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  activeTab: 'received' | 'sent' = 'received';
  received: Suggestion[] = [];
  sent: Suggestion[] = [];
  loading = false;

  // reply UI
  replyingToId: number | null = null;
  replyText = '';

  constructor(private suggestionService: SuggestionService) {}

  ngOnInit(): void {
    this.loadReceived();
    this.loadSent();
  }

  loadReceived(): void {
    this.loading = true;
    this.suggestionService.getReceivedSuggestions().subscribe({
      next: (res: Suggestion[]) => {
        this.received = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load received suggestions', err);
        this.loading = false;
      }
    });
  }

  loadSent(): void {
    this.suggestionService.getMySuggestions().subscribe({
      next: (res: Suggestion[]) => this.sent = res,
      error: (err) => console.error('Failed to load sent suggestions', err)
    });
  }

  accept(s: Suggestion) {
    if (!confirm('Apply this suggestion to the post content?')) return;
    this.suggestionService.acceptSuggestion(s.suggestionId).subscribe({
      next: () => {
        alert('Suggestion accepted.');
        this.loadReceived();
      },
      error: (err) => console.error(err)
    });
  }

  reject(s: Suggestion) {
    if (!confirm('Reject this suggestion?')) return;
    this.suggestionService.rejectSuggestion(s.suggestionId).subscribe({
      next: () => {
        alert('Suggestion rejected.');
        this.loadReceived();
      },
      error: (err) => console.error(err)
    });
  }

  startReply(suggestionId: number) {
    this.replyingToId = suggestionId;
    this.replyText = '';
  }

  cancelReply() {
    this.replyingToId = null;
    this.replyText = '';
  }

  submitReply() {
    if (!this.replyingToId) return;
    if (!this.replyText?.trim()) {
      alert('Reply cannot be empty');
      return;
    }

    const dto = {
      suggestionText: this.replyText,
      postId: 0 // backend uses parent suggestion's postId — it's okay to send 0 or omit
    };

    this.suggestionService.replyToSuggestion(this.replyingToId, dto).subscribe({
      next: () => {
        alert('Reply posted');
        this.loadReceived();
        this.cancelReply();
      },
      error: (err:any) => console.error('Reply failed', err)
    });
  }
}
