import { Component,Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../Postservice/post.service.interceptor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './post-list.component.html'
})
export class PostListComponent {
  posts: any[] = [];
  selectedCategory: string = '';
  categories = ["All","Technology", "Education", "Sports", "News"];
  page = 1;
  pageSize = 4;
  total = 0;
  loading = false;
  error = '';
  isLoggedIn = false;
  customCategory: string = '';
searchText: string = '';
totalPages: number = 0;
 constructor(
    private postService: PostService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Safe check for localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem("JwtToken");
    }
  }
ngOnInit() {
  this.load(this.selectedCategory);
}
load(category?: string, search?: string) {
  this.loading = true;

  const req = this.isLoggedIn
    ? this.postService.list(this.page, this.pageSize, category, search)
    : this.postService.getApproved(this.page, this.pageSize, category, search);

  req.subscribe({
    next: (res: any) => {
      this.posts = res.posts;
      this.total = res.total;
      this.totalPages = Math.ceil(this.total / this.pageSize);
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to load posts';
      this.loading = false;
    }
  });
}




onCategoryChange(category: string) {
  if (category === 'Other' && this.customCategory) {
    // Wait for custom input to be entered
    return;
  }
  const finalCategory =
    category === 'Other' ? this.customCategory : category || '';
  this.page = 1;
  this.load(finalCategory, this.searchText);
}
onSearch() {
  const category =
    this.selectedCategory === 'Other' ? this.customCategory : this.selectedCategory;
  this.page = 1;
  this.load(category, this.searchText);
}

  excerpt(text: string) {
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  }

  next() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
     this.load(this.selectedCategory);
    }
  }

  prev() {
    if (this.page > 1) {
      this.page--;
     this.load(this.selectedCategory);
    }
  }
}
