import { HttpInterceptorFn } from '@angular/common/http';

export const postServiceInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('JwtToken');
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};
