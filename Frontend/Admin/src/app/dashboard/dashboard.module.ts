import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard.component';
import { LazyTranslationsModule } from '../shared/translations/lazyTranslations.module';
import { CarInventoryComponent } from './car-inventory/car-inventory.component';
import { PriceFiltersComponent } from './price-filters/price-filters.component';
import { DepositSettingsComponent } from './deposit-settings/deposit-settings.component';
import { UnavailableCarsComponent } from './unavailable-cars/unavailable-cars.component';
import { BillingsComponent } from './billings/billings.component';
import { LocationsComponent } from './locations/locations.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../shared/shared.module';
import { FilterBookingsComponent } from './filter-bookings/filter-bookings.component';
import { BookingsCalendarComponent } from './calendar/bookings-calendar/bookings-calendar.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UnsavedChangesGuard } from './unsaved-form.guard';

@NgModule({
  declarations: [
    CalendarComponent,
    DashboardComponent,
    SidebarComponent,
    CarInventoryComponent,
    PriceFiltersComponent,
    DepositSettingsComponent,
    UnavailableCarsComponent,
    BillingsComponent,
    LocationsComponent,
    InsurancesComponent,
    SettingsComponent,
    FilterBookingsComponent,
    BookingsCalendarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LazyTranslationsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule
  ],
  providers: [UnsavedChangesGuard],
  exports: [BookingsCalendarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
