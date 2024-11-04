import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchQueryParamsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const queryParams = route.queryParams;
    const hasRequiredParams = queryParams.hasOwnProperty('pickupDate') &&
                              queryParams.hasOwnProperty('dropoffDate') &&
                              queryParams.hasOwnProperty('pickupLocationId') &&
                              queryParams.hasOwnProperty('dropoffLocationId') &&
                              queryParams.hasOwnProperty('pickupLocationName') &&
                              queryParams.hasOwnProperty('dropoffLocationName');

    if (!hasRequiredParams) {
      return this.router.parseUrl('/not-found');
    }

    return true;
  }
}
