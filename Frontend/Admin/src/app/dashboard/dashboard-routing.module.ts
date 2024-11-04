import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardComponent } from './dashboard.component';
import { CarInventoryComponent } from './car-inventory/car-inventory.component';
import { PriceFiltersComponent } from './price-filters/price-filters.component';
import { DepositSettingsComponent } from './deposit-settings/deposit-settings.component';
import { UnavailableCarsComponent } from './unavailable-cars/unavailable-cars.component';
import { BillingsComponent } from './billings/billings.component';
import { LocationsComponent } from './locations/locations.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { SettingsComponent } from './settings/settings.component';
import { UnsavedChangesGuard } from './unsaved-form.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'calendar', component: CalendarComponent },
      { path: 'car-inventory', component: CarInventoryComponent },
      { path: 'price-filters', component: PriceFiltersComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'deposit-settings', component: DepositSettingsComponent },
      { path: 'unavailable-cars', component: UnavailableCarsComponent },
      { path: 'billings', component: BillingsComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'insurances', component: InsurancesComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
