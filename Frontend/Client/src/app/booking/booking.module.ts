import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { SharedModule } from '../shared/shared.module';
import { TranslationsModule } from '../shared/translations/translations.module';
import { BookingSucceededComponent } from './booking-succeeded/booking-succeeded.component';
import { PickupDropoffSummaryComponent } from './pickup-dropoff-summary/pickup-dropoff-summary.component';
import { RentalSummaryComponent } from './rental-summary/rental-summary.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
@NgModule({
  declarations: [CreateBookingComponent, DriverDetailsComponent, BookingSucceededComponent, PickupDropoffSummaryComponent, RentalSummaryComponent, ManageBookingComponent],
  imports: [CommonModule, SharedModule, TranslationsModule],
  exports: [],
})
export class BookingModule {}
