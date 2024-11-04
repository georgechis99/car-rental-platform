import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, filter } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';
import { VehicleDetails } from 'src/app/shared/models/vehicleDetails';

@Component({
  selector: 'app-filter-bookings',
  templateUrl: './filter-bookings.component.html',
  styleUrls: ['./filter-bookings.component.scss'],
})
export class FilterBookingsComponent {
  bookingsCalendarForm: FormGroup;
  currentUser$: Observable<User>;

  @Output() filterBookingsSubmitted: EventEmitter<{
    vehicleId: string;
  }> = new EventEmitter<{
    vehicleId: string;
  }>();

  vehicleDetails: { name: string; value: string }[];

  constructor(
    private dashboardService: DashboardService,
    private accountService: AccountService
  ) {
    this.createBookingsCalendarForm();
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      if(user){
        const ownerEmail = user.email;
        this.getVehicleDetailsForOwner(ownerEmail);
      }
    });
  }

  createBookingsCalendarForm() {
    this.bookingsCalendarForm = new FormGroup({
      vehicleId: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.bookingsCalendarForm.valid) {
      const formValue = this.bookingsCalendarForm.value;
      const vehicleId: string = formValue.vehicleId;
      const filterData = {
        vehicleId: vehicleId,
      };
      this.filterBookingsSubmitted.emit(filterData);
    }
  }

  getVehicleDetailsForOwner(ownerEmail: string) {
    this.dashboardService
      .getVehicleDetailsForOwner(ownerEmail)
      .subscribe((details: VehicleDetails[]) => {
        this.vehicleDetails = details.map((detail: VehicleDetails) => ({
          name:
            detail.vehicleRegistrationNumber +
            ' (' +
            detail.vehicleBrand +
            ' ' +
            detail.vehicleModel +
            ')',
          value: detail.id.toString(),
        }));
      });
  }
}
