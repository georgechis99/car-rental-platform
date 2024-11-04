import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { VehicleDetails } from 'src/app/shared/models/vehicleDetails';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unavailable-cars',
  templateUrl: './unavailable-cars.component.html',
  styleUrls: ['./unavailable-cars.component.scss'],
})
export class UnavailableCarsComponent implements OnInit {
  unavailableCarsForm: FormGroup;
  vehicleDetails: { name: string; value: string }[];
  selectReasonValues: { name: string; value: string }[] = [];
  currentUser$: Observable<User>;

  minStartDate: Date = this.getCurrentDate(1);

  constructor(
    private translate: TranslateService,
    private dashboardService: DashboardService,
    private accountService: AccountService
  ) {
    this.createunavailableCarsForm();

    this.selectReasonValues = [
      {
        name: "dashboard.unavailable-cars.reason-1",
        value: "Third-party rental"
      },
      {
        name: "dashboard.unavailable-cars.reason-2",
        value: "Repairs"
      },
      {
        name: "dashboard.unavailable-cars.reason-3",
        value: "Personal reasons"
      }
    ];
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      const ownerEmail = user.email;
      this.getVehicleDetailsForOwner(ownerEmail);
    });
  }

  createunavailableCarsForm() {
    this.unavailableCarsForm = new FormGroup({
      startDate: new FormControl<Date>(null, [Validators.required]),
      endDate: new FormControl<Date>(null, [
        Validators.required,
        (control: FormControl) => this.endDateValidator(control),
      ]),
      startTime: new FormControl<Date>(null, [
        Validators.required,
        this.startTimeValidator,
      ]),
      endTime: new FormControl<Date>(null, Validators.required),
      vehicleId: new FormControl('', [Validators.required]),
    });

    this.unavailableCarsForm.get('startDate').valueChanges.subscribe((startDate) => {
      if (startDate) {
        const minStartDate = new Date(startDate);
        minStartDate.setDate(minStartDate.getDate() + 1);
        this.minStartDate = minStartDate;
        this.unavailableCarsForm.get('endDate').enable();
      }
    });
  }

  onSubmit() {
    if (this.unavailableCarsForm.valid) {
      const formValue = this.unavailableCarsForm.value;
      const startDate: Date = formValue.startDate;
      const endDate: Date = formValue.endDate;
      const vehicleId: string = formValue.vehicleId;

      const filterData = {
        startDate,
        endDate,
        vehicleId: vehicleId,
      };
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

  endDateValidator = (control: FormControl) => {
    if (!control || !this.unavailableCarsForm) {
      return null;
    }

    const fromDate = this.unavailableCarsForm.get('endDate').value;

      const selectedDate = new Date(control.value);
      const minToDate = new Date(fromDate);
      minToDate.setDate(minToDate.getDate() + 1);
      return selectedDate <= minToDate
        ? null
        : {
            tooSoon: this.translate.instant(
              'shared.date-input.dropoff-must-be-after-pickup'
            ),
          };
  };

  startTimeValidator = (control: FormControl) => {
    if (!control || !this.unavailableCarsForm) {
      return null;
    }

    const startDate = this.unavailableCarsForm.get('startDate').value;

    if (startDate) {
      const now = new Date();
      const selectedTime = new Date(`${startDate}T${control.value}`);

      if (now.toDateString() === new Date(startDate).toDateString()) {
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        return selectedTime >= oneHourFromNow
          ? null
          : {
              tooSoon: this.translate.instant(
                'shared.time-input.pickup-time-must-be-one-hour-in-the-future'
              ),
            };
      }
    }
    return null;
  };

  getCurrentDate(daysToAdd: number = 0): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate;
  }
}
