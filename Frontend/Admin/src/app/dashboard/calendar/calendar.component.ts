import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../dashboard.service';
import { Booking } from 'src/app/shared/models/booking';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';
import { VehicleUnavailability } from 'src/app/shared/models/vehicleUnavailability';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    DatePipe,
    ConfirmationDialogService
  ]
})
export class CalendarComponent implements OnInit {
  bookingsCalendarForm: FormGroup;
  currentUser$: Observable<User>;
  apiBookings: Booking[];
  apiUnavailableDates: VehicleUnavailability[];
  bookings: Date[] = [];
  unavailableDates: Date[] = [];
  showCalendar: boolean;
  selectedDate: Date;
  formattedDate: any;

  selectedBooking: Booking;
  selectedUnavailability: VehicleUnavailability;

  hasEvents: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private datePipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;

  }

  onSelectedDate(selectedDate){
    this.selectedDate = selectedDate;
    this.hasEvents = false;

    // Convert selectedDate to the same format as booking.pickupDate and booking.dropoffDate
    const formattedSelectedDate = new Date(this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss'));

    for (let i = 0; i < this.apiBookings.length; i++) {
      const booking = this.apiBookings[i];
      const pickupDate = new Date(booking.pickupDate);
      const dropoffDate = new Date(booking.dropoffDate);

      if (pickupDate <= formattedSelectedDate && dropoffDate >= formattedSelectedDate) {
        this.selectedBooking = booking;
        this.selectedUnavailability = null;
        this.hasEvents = true;
        console.log(booking);
        break;
      }
    }

    for (let i = 0; i < this.apiUnavailableDates.length; i++) {
      const unavailableDate = this.apiUnavailableDates[i];
      const startDate = new Date(unavailableDate.startDate);
      const endDate = new Date(unavailableDate.endDate);

      if (startDate <= formattedSelectedDate && endDate >= formattedSelectedDate) {
        this.selectedUnavailability = unavailableDate;
        this.selectedBooking = null;
        this.hasEvents = true;
        console.log(unavailableDate);

        break;
      }
    }
  }

  onBlockDate(){
    console.log(this.selectedDate);
  }

  onApproveBooking(){
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
    .then((confirmed) => console.log('User confirmed:', confirmed))
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  onFilterBookingsSubmitted(filterData: { vehicleId: string }) {
    this.selectedBooking = null;
    this.selectedUnavailability = null;
    this.hasEvents = true;

    this.dashboardService
      .getBookingsForVehicle(
        filterData.vehicleId,
      )
      .subscribe({
        next: (response) => {
          this.apiBookings = response;
          this.bookings = this.convertBookingsToDates(response);
        },
        error: (error) => console.log(error),
      });

    this.dashboardService
      .getUnavailableDatesForVehicle(filterData.vehicleId)
      .subscribe({
        next: (response) => {
          this.apiUnavailableDates = response;
          this.unavailableDates = this.convertUnavToDates(response);
        },
        error: (error) => console.log(error),
      });
  }

  convertBookingsToDates(bookings: Booking[]): Date[] {
    const dates: Date[] = [];
    for (const booking of bookings) {
      const pickupDate: Date = new Date(booking.pickupDate);
      const dropoffDate: Date = new Date(booking.dropoffDate);
      const interval = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
      const numDays = Math.ceil(interval / (1000 * 60 * 60 * 24)); // Calculate the number of days between pickup and dropoff dates
      for (let i = 0; i <= numDays; i++) {
        const date = new Date(pickupDate);
        date.setDate(pickupDate.getDate() + i);
        dates.push(date);
      }
    }
    return dates;
  }

  convertUnavToDates(unavailableDates: VehicleUnavailability[]): Date[] {
    const dates: Date[] = [];
    for (const unav of unavailableDates) {
      const startDate: Date = new Date(unav.startDate);
      const endDate: Date = new Date(unav.endDate);
      const interval = Math.abs(endDate.getTime() - startDate.getTime());
      const numDays = Math.ceil(interval / (1000 * 60 * 60 * 24)); // Calculate the number of days between pickup and dropoff dates
      for (let i = 0; i <= numDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    }
    return dates;
  }
}
