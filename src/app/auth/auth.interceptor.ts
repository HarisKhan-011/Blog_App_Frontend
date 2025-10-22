import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR safe: don't touch localStorage or redirect on the server
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = localStorage.getItem('JwtToken');
  let cloned = req;

  if (token) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(cloned).pipe(
    tap({
      error: (error: any) => {
        if (error.status === 401) {
          // Unauthorized → token expired or invalid
          localStorage.removeItem('JwtToken');
          alert('Session expired. Please log in again.');
          router.navigate(['/login']);
        }
      },
    })
  );
};
