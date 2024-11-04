import { Vehicle } from './../../shared/models/vehicle';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';
import { DashboardService } from '../dashboard.service';
import { VehicleDetails } from 'src/app/shared/models/vehicleDetails';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car-inventory',
  templateUrl: './car-inventory.component.html',
  styleUrls: ['./car-inventory.component.scss'],
})
export class CarInventoryComponent {
  carInventoryForm: FormGroup;
  currentUser$: Observable<User>;
  vehicleDetails: { name: string; value: string }[];
  selectedVehicle: Vehicle;

  public isFormDisabled = true;

  public readonly carStatuses = ['Available', 'Unavailable'];
  public readonly transmissionTypes = ['Manual', 'Automatic'];
  public readonly fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  public readonly hasAirConditioning = ['Yes', 'No'];
  public readonly noOfDoors = ['1', '2', '3', '4', '5'];
  public readonly luggageCapacities = ['1', '2', '3', '4', '5', '6'];
  public readonly maxNoOfPassengers = ['1', '2', '3', '4', '5', '6', '7'];

  constructor(
    private translate: TranslateService,
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.createCarInventoryForm();
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      const ownerEmail = user.email;
      this.getVehicleDetailsForOwner(ownerEmail);
    });
  }

  createCarInventoryForm() {
    this.carInventoryForm = new FormGroup({
      vrn: new FormControl(''),
      status: new FormControl(''),
    });

    this.disableForm();
  }

  disableForm() {
    this.carInventoryForm.disable();
    this.isFormDisabled = true;
  }

  enableForm() {
    this.carInventoryForm.enable();
    this.isFormDisabled = false;
  }

  isFormReadyForSubmit(): boolean {
    return this.carInventoryForm.valid && this.carInventoryForm.dirty;
  }

  onSubmit() {
    if (this.carInventoryForm.valid) {
      var updatedVehicle = this.convertFormValuesToVehicle();

      this.dashboardService
        .updateVehicle(this.selectedVehicle.id, updatedVehicle)
        .subscribe({
          next: () => {
            this.dashboardService
              .getVehicleById(this.selectedVehicle.id)
              .subscribe((vehicle: Vehicle) => {
                this.selectedVehicle = vehicle;
                this.enableForm();
                if (this.selectedVehicle) {
                  this.populateFormValues(this.selectedVehicle);
                }
              });
            this.toastr.success(
              this.translate.instant('toastr.success.vehicle-edited')
            );
          },
          error: (error) => {
            this.toastr.error(
              this.translate.instant('toastr.error.try-again-or-contact')
            );
          },
        });
    }
  }

  convertFormValuesToVehicle(): Vehicle {
    var vehicleToReturn = new Vehicle(this.selectedVehicle);
    vehicleToReturn.vehicleRegistrationNumber = this.carInventoryForm.value.vrn;
    vehicleToReturn.isAvailable =
      this.carInventoryForm.value.status === 'Available' ? true : false;

    return vehicleToReturn;
  }

  onVehicleSelected(event: any) {
    this.dashboardService
      .getVehicleById(event.target.value)
      .subscribe((vehicle: Vehicle) => {
        this.selectedVehicle = vehicle;
        this.enableForm();
        if (this.selectedVehicle) {
          this.populateFormValues(this.selectedVehicle);
        }
      });
  }

  populateFormValues(vehicle: Vehicle) {
    console.log(vehicle.vehicleRegistrationNumber);
    this.carInventoryForm.setValue({
      vrn: vehicle.vehicleRegistrationNumber,
      status: vehicle.isAvailable == true ? 'Available' : 'Unavailable',
    });
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
