import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  email: string | null = null;
  role: string | null = null;
  name: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role');
      this.name = localStorage.getItem('username') || '';
      this.getUsernameFromToken();
    }
  }

  getUsernameFromToken() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('JwtToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.email = decodedToken?.name || decodedToken?.email || null;
      }
    }
  }

  getemail() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('email');
    }
    return null;
  }

  isLoggedIn(): boolean {
  if (!isPlatformBrowser(this.platformId)) return false;

  const token = localStorage.getItem('JwtToken');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp; // token valid
  } catch {
    return false;
  }
}

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('JwtToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      this.role = null;
      this.router.navigate(['/login']);
      window.location.reload();
      alert('Now you are logged out');
    }
  }

  getRole() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  isModerator() {
    return this.getRole() === 'Moderator';
  }

  isAdmin() {
    return this.getRole() === 'Admin';
  }
}
