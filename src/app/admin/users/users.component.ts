import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../Signupservices/user.service';
interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  isEmailConfirmed?: boolean;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports:[CommonModule],
  standalone:true
})
export class UsersComponent implements OnInit {
  users: UserRow[] = [];
  loading = false;
  roles = ['User', 'Moderator', 'Admin'];
  currentAdminEmail = localStorage.getItem('email') || '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res:any) => { this.users = res; this.loading = false; },
      error: (err:any) => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
  }

  changeRole(user: UserRow, newRole: string) {
    if (user.email === this.currentAdminEmail) {
      alert("You cannot change your own role.");
      return;
    }

    if (!confirm(`Change role of ${user.email} to ${newRole}?`)) return;

    this.userService.setRole(user.id, newRole).subscribe({
      next: () => {
        alert('Role updated successfully.');
        this.loadUsers();
      },
      error: (err:any) => {
        console.error('Failed to update role', err);
        alert(err?.error?.message || 'Failed to update role.');
      }
    });
  }
}
