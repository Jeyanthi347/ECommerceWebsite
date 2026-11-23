
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = sessionStorage.getItem('accessToken');

  const roles: string[] = JSON.parse(
    sessionStorage.getItem('userRoles') || '[]'
  );

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  if (!roles.includes('Admin')) {
    return router.createUrlTree(['/products']);
  }

  return true;
};
