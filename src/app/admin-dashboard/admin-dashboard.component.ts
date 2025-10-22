import { Component, OnInit } from '@angular/core';
import { AdminService } from '../Adminservice/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ needed for ngModel

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  posts: any[] = [];
  comments: any[] = [];
  reports: any[] = [];
  suggestions: any[] = [];
  activeTab: string = 'users';
  loading = false;

  // 🔍 Search + Pagination
  searchTerm: string = '';
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // 🔁 Loaders for each section
  loadUsers() {
  this.loading = true;
  this.adminService.getUsers().subscribe({
    next: res => {
      this.users = res;
      this.activeTab = 'users';
      this.loading = false;
      this.refreshData();
    },
    error: err => { console.error(err); this.loading = false; }
  });
}


  loadPosts() {
    this.loading = true;
    this.adminService.getPosts().subscribe({
      next: res => {
        this.posts = res;
        this.activeTab = 'posts';
        this.loading = false;
        this.filterData();
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  loadComments() {
    this.loading = true;
    this.adminService.getComments().subscribe({
      next: res => {
        this.comments = res;
        this.activeTab = 'comments';
        this.loading = false;
        this.filterData();
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  loadReports() {
    this.loading = true;
    this.adminService.getReports().subscribe({
      next: res => {
        this.reports = res;
        this.activeTab = 'reports';
        this.loading = false;
        this.filterData();
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  loadSuggestions() {
    this.loading = true;
    this.adminService.getSuggestions().subscribe({
      next: res => {
        this.suggestions = res;
        this.activeTab = 'suggestions';
        this.loading = false;
        this.filterData();
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  // 🗑️ Delete actions
  deleteUser(id: number) { this.adminService.deleteUser(id).subscribe(() => this.loadUsers()); }
  deletePost(id: number) { this.adminService.deletePost(id).subscribe(() => this.loadPosts()); }
  deleteComment(id: number) { this.adminService.deleteComment(id).subscribe(() => this.loadComments()); }
  deleteReport(id: number) { this.adminService.deleteReport(id).subscribe(() => this.loadReports()); }
  deleteSuggestion(id: number) { this.adminService.deleteSuggestion(id).subscribe(() => this.loadSuggestions()); }
deleteItem(item: any) {
  switch (this.activeTab) {
    case 'posts': this.deletePost(item.id); break;
    case 'comments': this.deleteComment(item.id); break;
    case 'reports': this.deleteReport(item.id); break;
    case 'suggestions': this.deleteSuggestion(item.id); break;
  }
}
  // 🎚️ Change role
  changeRole(userId: number, newRole: string) {
    this.adminService.setUserRole(userId, newRole).subscribe(() => this.loadUsers());
  }

  // ===============================
  // 🔍 SEARCH + PAGINATION SYSTEM
  // ===============================
// 🔑 Dynamically get table headers (first row’s keys)
getTableHeaders(): string[] {
  const data = this.getActiveTabData();
  return data.length ? Object.keys(data[0]) : [];
}

// 🔑 Get all keys of a given row (item)
getTableKeys(item: any): string[] {
  return Object.keys(item);
}

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getActiveTabData() {
    switch (this.activeTab) {
      case 'users': return this.users;
      case 'posts': return this.posts;
      case 'comments': return this.comments;
      case 'reports': return this.reports;
      case 'suggestions': return this.suggestions;
      default: return [];
    }
  }

  // 🔍 Filter data based on search term
filterData() {
  let data = [];

  // Pick the currently active dataset
  switch (this.activeTab) {
    case 'users': data = this.users; break;
    case 'posts': data = this.posts; break;
    case 'comments': data = this.comments; break;
    case 'reports': data = this.reports; break;
    case 'suggestions': data = this.suggestions; break;
  }

  // Apply search
  const term = this.searchTerm.toLowerCase();
  this.filteredData = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(term))
  );

  this.currentPage = 1;
  this.updatePagination();
}

// 🧮 Pagination calculation
updatePagination() {
  this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedData = this.filteredData.slice(startIndex, endIndex);
}

// 🔁 When page is changed
changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePagination();
}

// 🧹 Refresh pagination when switching tabs or reloading data
refreshData() {
  this.filterData();
}

}
