import { Component, Input } from '@angular/core';
import { Booking } from 'src/app/shared/models/booking';

@Component({
  selector: 'app-booking-succeeded',
  templateUrl: './booking-succeeded.component.html',
  styleUrls: ['./booking-succeeded.component.scss']
})
export class BookingSucceededComponent {
  @Input() booking: Booking;

}
