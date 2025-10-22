import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Run only in browser
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('JwtToken');

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('JwtToken');
      alert('Session expired. Please log in again.');
      router.navigate(['/login']);
      return false;
    }

    return true;
  }

  // ✅ On server: allow SSR to continue without blocking
  return true;
};
