import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user';
import { Booking } from '../shared/models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  createGuestBooking(values: any) {
    return this.http
      .post(this.baseUrl + 'booking/guest', values)
      .pipe(map((booking: Booking) => {}));
  }

  createUserBooking(values: any) {
    return this.http
      .post(this.baseUrl + 'booking/user', values)
      .pipe(map((booking: Booking) => {}));
  }
}
