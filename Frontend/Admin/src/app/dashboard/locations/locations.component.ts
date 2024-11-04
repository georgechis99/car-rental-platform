import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { DashboardService } from '../dashboard.service';
import { User } from 'src/app/shared/models/user';
import { PickupDropoffLocation } from 'src/app/shared/models/pickupDropoffLocation';
import { FormatWidth } from '@angular/common';
import { forkJoin, Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent {
  locationsForm: FormGroup;
  currentUser$: any;
  headquarterLocationsArray: any[];
  deliveryLocationsArray: any[];

  constructor(
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.createLocationsForm();
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      const ownerEmail = user.email;
      this.getPickupDropoffLocationsForOwnerEmail(ownerEmail);
    });
  }

  getPickupDropoffLocationsForOwnerEmail(ownerEmail: any) {
    this.dashboardService
      .getPickupDropoffLocationsForOwnerEmail(ownerEmail)
      .subscribe((locations: PickupDropoffLocation[]) => {
        const pairedLocations = this.pairPickupDropoffLocations(locations);
        this.headquarterLocationsArray = pairedLocations.withDeliveryFeeNull;
        this.deliveryLocationsArray = pairedLocations.withDeliveryFeeNotNull;


        this.populateFormValues();
      });
  }

  populateFormValues() {
    if (this.headquarterLocationsArray && this.deliveryLocationsArray) {
      const headquarterFormGroups$ = this.headquarterLocationsArray.map(
        (headquarterLocation) =>
          this.createHeadquartersGroupFromObject(headquarterLocation)
      );

      const deliveryFormGroups$ = this.deliveryLocationsArray.map(
        (deliveryLocation) =>
          this.createDeliveriesGroupFromObject(deliveryLocation)
      );

      forkJoin(headquarterFormGroups$).subscribe((headquarterFormGroups) => {
        const headquarterFormArray = new FormArray(headquarterFormGroups);
        this.locationsForm.setControl(
          'headquarterLocations',
          headquarterFormArray
        );

        forkJoin(deliveryFormGroups$).subscribe((deliveryFormGroups) => {
          const deliveryFormArray = new FormArray(deliveryFormGroups);
          this.locationsForm.setControl('deliveryLocations', deliveryFormArray);

          // Now that both form arrays are set, you can access their values.
          console.log(this.locationsForm.value);
        });
      });
    }
  }

  getLocationNameById(locationId: number) {
    this.dashboardService
      .getLocationNameById(locationId)
      .subscribe((locationName) => {
        return locationName;
      });
  }

  createLocationsForm() {
    this.locationsForm = new FormGroup({
      headquarterLocations: new FormArray<FormGroup>([]),
      deliveryLocations: new FormArray<FormGroup>([]),
    });
  }

  createHeadquartersGroupFromObject(
    headquarterLocation?: any
  ): Observable<FormGroup> {
    if (!headquarterLocation || !headquarterLocation.locationId) {
      return of(new FormGroup({ location: new FormControl<string>(null, Validators.required) }));
    }

    return this.dashboardService
      .getLocationNameById(headquarterLocation.locationId)
      .pipe(
        map((result) => {
          const formGroup = new FormGroup({
            location: new FormControl(result.locationName),
          });
          return formGroup;
        })
      );
  }

  createDeliveriesGroupFromObject(deliveryLocation?: any): Observable<FormGroup> {
    if (!deliveryLocation || !deliveryLocation.locationId) {
      return of(new FormGroup({
        location: new FormControl<string>(null, Validators.required),
        deliveryFee: new FormControl<number>(0, Validators.required),
      }));
    }

    const locationId = deliveryLocation.locationId;
    const deliveryFee = deliveryLocation.deliveryFee;

    return this.dashboardService.getLocationNameById(locationId).pipe(
      map((result) => {
        const formGroup = new FormGroup({
          location: new FormControl(result.locationName),
          deliveryFee: new FormControl(deliveryFee),
        });
        return formGroup;
      })
    );
  }

  addDeliveryLocation() {
    this.createDeliveriesGroupFromObject().subscribe((formGroup) => {
      this.deliveryLocations.push(formGroup);
    });
    this.locationsForm.markAsDirty();

    this.deliveryLocationsArray = this.deliveryLocations.controls.map(
      (control) => control.value
    );
  }

  addHeadquarterLocation() {
    this.createHeadquartersGroupFromObject().subscribe((formGroup) => {
      this.headquarterLocations.push(formGroup);
    });
    this.locationsForm.markAsDirty();

    this.headquarterLocationsArray = this.headquarterLocations.controls.map(
      (control) => control.value
    );
  }

  removeHeadquarterLocation(i: number) {
    this.headquarterLocations.removeAt(i);
    this.locationsForm.markAsDirty();

    this.headquarterLocationsArray = this.headquarterLocations.controls.map(
      (control) => control.value
    );
  }

  removeDeliveryLocation(i: number) {
    this.deliveryLocations.removeAt(i);
    this.locationsForm.markAsDirty();

    this.deliveryLocationsArray = this.deliveryLocations.controls.map(
      (control) => control.value
    );
  }


  public get headquarterLocations() {
    return <FormArray>this.locationsForm.get('headquarterLocations');
  }

  public get deliveryLocations() {
    return <FormArray>this.locationsForm.get('deliveryLocations');
  }

  onSubmit() {
    console.log(this.locationsForm.value)
    console.log(this.deliveryLocationsArray)
      // this.dashboardService
      //   .updateDiscounts(
      //     this.getDiscountsUpdateModel(this.priceFiltersForm.value)
      //   )
      //   .subscribe({
      //     next: () => {
      //       this.disableForm();
      //       this.onVehicleSelected(null, this.selectedVehicle.id);
      //       this.toastr.success(
      //         this.translate.instant('toastr.success.vehicle-edited')
      //       );
      //       this.priceFiltersForm.markAsPristine();
      //     },
      //     error: (error) => {
      //       this.toastr.error(
      //         this.translate.instant('toastr.error.try-again-or-contact')
      //       );
      //     },
      //   });
  }

  pairPickupDropoffLocations(locations: PickupDropoffLocation[]): {
    withDeliveryFeeNotNull: { locationId: number; deliveryFee: number }[];
    withDeliveryFeeNull: { locationId: number }[];
  } {
    const withDeliveryFeeNotNull: {
      locationId: number;
      deliveryFee: number;
    }[] = [];
    const withDeliveryFeeNull: { locationId: number }[] = [];

    const unpairedLocations: PickupDropoffLocation[] = [...locations];
    const processedLocationIds: Set<number> = new Set();

    while (unpairedLocations.length > 0) {
      const currentLocation = unpairedLocations.shift();

      if (processedLocationIds.has(currentLocation.locationId)) {
        continue;
      }

      const matchingLocations = unpairedLocations.filter(
        (location) =>
          location.locationId === currentLocation.locationId &&
          location.vehicleId === currentLocation.vehicleId &&
          location.isPickup !== currentLocation.isPickup
      );

      if (matchingLocations.length === 1) {
        const pairedLocation = matchingLocations[0];
        unpairedLocations.splice(unpairedLocations.indexOf(pairedLocation), 1);
        processedLocationIds.add(currentLocation.locationId);

        if (
          currentLocation.deliveryFee === null &&
          pairedLocation.deliveryFee === null
        ) {
          withDeliveryFeeNull.push({
            locationId: currentLocation.locationId,
          });
        } else if (currentLocation.deliveryFee !== null) {
          withDeliveryFeeNotNull.push({
            locationId: currentLocation.locationId,
            deliveryFee: currentLocation.deliveryFee,
          });
        }
      } else if (matchingLocations.length === 0) {
        console.error(
          `No pair found for locationId ${currentLocation.locationId} and vehicleId ${currentLocation.vehicleId}`
        );
      }
    }

    return {
      withDeliveryFeeNotNull: withDeliveryFeeNotNull,
      withDeliveryFeeNull: withDeliveryFeeNull,
    };
  }

  isFormReadyForSubmit(): boolean {
    return this.locationsForm.valid && this.locationsForm.dirty;
  }
}
