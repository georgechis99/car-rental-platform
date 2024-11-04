import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PriceFiltersComponent } from './price-filters/price-filters.component';
import { Observable } from 'rxjs';

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<PriceFiltersComponent> {
  canDeactivate(
    component: PriceFiltersComponent,
  ): boolean | Observable<boolean> {
    if (!component.isFormReadyForSubmit() || !component.priceFiltersForm.dirty) {
      // The form is ready for submit or there are no changes, allow navigation
      return true;
    }

    // Display a confirmation dialog before navigating away
    return confirm(
      'Are you sure you want to close this form? Your changes will be lost.',
    );
  }
  }

