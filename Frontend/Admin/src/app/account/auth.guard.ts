import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true; // User is logged in, allow navigation
        } else {
          this.router.navigateByUrl('/not-found'); // User is not logged in, redirect to not-found route
          return false;
        }
      })
    );
  }
}
