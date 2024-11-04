import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';

@Component({
  selector: 'app-filter-deals',
  templateUrl: './filter-deals.component.html',
  styleUrls: ['./filter-deals.component.scss'],
})
export class FilterDealsComponent implements OnInit {
  @Input() vehicleParams?: VehicleParams;
  @Output() filterDealsSubmitted: EventEmitter<void> = new EventEmitter<void>();
  filterDealsForm: FormGroup;
  minDropoffDate: Date = this.getCurrentDate(1);
  isDifferentDropoffLocation: boolean = false;
  defaultPickupTime: string;
  defaultDropoffTime: string;

  constructor(private router: Router, private translate: TranslateService) {
    this.createFilterDealsForm();
  }

  ngOnInit(): void {
    if (this.vehicleParams) {
      this.populateFormWithInitialValues(this.vehicleParams);
    }
  }

  onDifferentDropoffLocationChange(event: any) {
    this.isDifferentDropoffLocation = event.target.checked;

    if (this.isDifferentDropoffLocation) {
      this.filterDealsForm.addControl(
        'dropoffLocation',
        new FormControl('', [Validators.required])
      );
    } else {
      this.filterDealsForm.removeControl('dropoffLocation');
    }
  }

  createFilterDealsForm() {
    this.filterDealsForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
      pickupDate: new FormControl<Date>(null, [Validators.required]),
      pickupTime: new FormControl<string>(null, [
        Validators.required,
        this.pickupTimeValidator,
      ]),
      dropoffDate: new FormControl<Date>(null, [
        Validators.required,
        (control: FormControl) => this.dropoffDateValidator(control),
      ]),
      dropoffTime: new FormControl<Date>(null, Validators.required),
    });

    this.filterDealsForm
      .get('pickupDate')
      .valueChanges.subscribe((pickupDate) => {
        this.filterDealsForm.get('pickupTime').updateValueAndValidity();

        if (pickupDate) {
          const minDropoffDate = new Date(pickupDate);
          minDropoffDate.setDate(minDropoffDate.getDate() + 1);
          this.minDropoffDate = minDropoffDate;
          this.filterDealsForm.get('dropoffDate').enable();
        } else {
          this.filterDealsForm.get('dropoffDate').disable();
          this.filterDealsForm.get('dropoffDate').setValue(null);
        }
      });


    this.calculateDefaultTime();
    this.filterDealsForm.get('pickupTime')?.setValue(this.defaultPickupTime);
    this.filterDealsForm.get('dropoffTime')?.setValue(this.defaultDropoffTime);
  }

  populateFormWithInitialValues(vehicleParams: VehicleParams) {
    this.filterDealsForm.patchValue({
      location: {
        id: vehicleParams.pickupLocationId,
        name: vehicleParams.pickupLocationName,
      },

      pickupDate: this.formatDate(vehicleParams.pickupDate),
      pickupTime: this.formatTime(vehicleParams.pickupDate),
      dropoffDate: this.formatDate(vehicleParams.dropoffDate),
      dropoffTime: this.formatTime(vehicleParams.dropoffDate),
    });

    if (vehicleParams.pickupLocationId && vehicleParams.dropoffLocationId && vehicleParams.pickupLocationId!=vehicleParams.dropoffLocationId) {
      this.filterDealsForm.addControl(
        'dropoffLocation',
        new FormControl('', [Validators.required])
      );

      this.filterDealsForm.patchValue({
        dropoffLocation: vehicleParams.dropoffLocationId
          ? {
              id: vehicleParams.dropoffLocationId,
              name: vehicleParams.dropoffLocationName,
            }
          : {
              id: vehicleParams.pickupLocationId,
              name: vehicleParams.pickupLocationName,
            },
      });
      this.isDifferentDropoffLocation = true;
    }
  }

  onSubmit() {
    if (this.filterDealsForm.valid) {
      let vehicleParams: VehicleParams = new VehicleParams();

      vehicleParams.pickupLocationId = this.filterDealsForm.value.location.id;
      vehicleParams.pickupLocationName = this.filterDealsForm.value.location.name;

      if (this.filterDealsForm.contains('dropoffLocation')) {
        vehicleParams.dropoffLocationId = this.filterDealsForm.value.dropoffLocation.id;
        vehicleParams.dropoffLocationName = this.filterDealsForm.value.dropoffLocation.name;
      } else {
        vehicleParams.dropoffLocationId = this.filterDealsForm.value.location.id;
        vehicleParams.dropoffLocationName = this.filterDealsForm.value.location.name;
      }

      const pickupDateTime = this.combineDateTime(
        this.filterDealsForm.value.pickupDate,
        this.filterDealsForm.value.pickupTime
      );
      const dropoffDateTime = this.combineDateTime(
        this.filterDealsForm.value.dropoffDate,
        this.filterDealsForm.value.dropoffTime
      );

      vehicleParams.pickupDate = pickupDateTime;
      vehicleParams.dropoffDate = dropoffDateTime;

      const queryParams = {
        pickupDate: vehicleParams.pickupDate.toISOString(),
        dropoffDate: vehicleParams.dropoffDate.toISOString(),
        pickupLocationId: vehicleParams.pickupLocationId,
        dropoffLocationId: vehicleParams.dropoffLocationId,
        pickupLocationName: vehicleParams.pickupLocationName,
        dropoffLocationName: vehicleParams.dropoffLocationName
      };

      // Navigate to ShopComponent with query parameters
      this.router.navigate(['/search-results'], { queryParams }).then(() => {
        this.filterDealsSubmitted.emit();
      });
      window.scrollTo(0, 0);
    }
  }

  getCurrentDate(daysToAdd: number = 0): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate;
  }

  combineDateTime(date: string, time: string): Date {
    const dateObject = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    dateObject.setHours(hours);
    dateObject.setMinutes(minutes);

    return dateObject;
  }

  formatDate(initialDate) {
    const date = new Date(initialDate);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  pickupTimeValidator = (control: FormControl) => {
    if (!control || !this.filterDealsForm) {
      return null;
    }

    const pickupDate = this.filterDealsForm.get('pickupDate').value;

    if (pickupDate) {
      const now = new Date();
      const selectedTime = new Date(`${pickupDate}T${control.value}`);

      if (now.toDateString() === new Date(pickupDate).toDateString()) {
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

  dropoffDateValidator = (control: FormControl) => {
    if (!control || !this.filterDealsForm) {
      return null;
    }

    const pickupDate = this.filterDealsForm.get('pickupDate').value;

    if (pickupDate) {
      const selectedDate = new Date(control.value);
      const minDropoffDate = new Date(pickupDate);
      minDropoffDate.setDate(minDropoffDate.getDate() + 1);
      return selectedDate >= minDropoffDate
        ? null
        : {
            tooSoon: this.translate.instant(
              'shared.date-input.dropoff-must-be-after-pickup'
            ),
          };
    }
    return null;
  };

  calculateDefaultTime() {
    const currentDate = new Date();
    const twoHoursInFuture = currentDate.getHours()+2;
    //Case on 01AM-09AM we need to add the digit 0 to the beginning
    if(twoHoursInFuture>=0 && twoHoursInFuture<10){
      this.defaultPickupTime = `0${twoHoursInFuture.toString()}:00`.toString();
      this.defaultDropoffTime = `0${twoHoursInFuture.toString()}:00`.toString();
    }
    if(twoHoursInFuture>=10 && twoHoursInFuture<=24){
      this.defaultPickupTime = `${twoHoursInFuture.toString()}:00`.toString();
      this.defaultDropoffTime = `${twoHoursInFuture.toString()}:00`.toString();
    }
  };
}


