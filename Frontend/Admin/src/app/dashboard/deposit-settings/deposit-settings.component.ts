import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { DashboardService } from '../dashboard.service';
import { VehicleDetails } from 'src/app/shared/models/vehicleDetails';
import { VehicleInsuranceDetail } from 'src/app/shared/models/vehicleInsuranceDetail';
import { InsuranceType } from 'src/app/shared/models/insuranceType';
import { VehicleInsuranceDetailsUpdateModel } from 'src/app/shared/models/vehicleInsuranceDetailsUpdateModel';

@Component({
  selector: 'app-deposit-settings',
  templateUrl: './deposit-settings.component.html',
  styleUrls: ['./deposit-settings.component.scss'],
})
export class DepositSettingsComponent {
  depositSettingsForm: FormGroup;
  currentUser$: Observable<User>;
  vehicleDetails: { name: string; value: string }[];
  selectedVehicle: Vehicle;
  vehicleInsuranceDetailsArray: VehicleInsuranceDetail[];
  insuranceTypes: InsuranceType[];

  public isFormDisabled = true;

  constructor(
    private translate: TranslateService,
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.createDepositSettingsForm();
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      const ownerEmail = user.email;
      this.getVehicleDetailsForOwner(ownerEmail);
    });
    this.dashboardService.getInsuranceTypes().subscribe((insuranceTypes) => {
      this.insuranceTypes = insuranceTypes;
    });
  }

  createDepositSettingsForm() {
    this.depositSettingsForm = new FormGroup({
      vehicleInsuranceDetails: new FormArray<FormGroup>([]),
    });

    this.disableForm();
  }

  translateInsuranceType(insuranceType: string) {
    switch (insuranceType) {
      case 'NoInsurance':
        return this.translate.instant(
          'dashboard.deposit-settings.no-insurance-option'
        );
      case 'LimitedInsurance':
        return this.translate.instant(
          'dashboard.deposit-settings.limited-insurance-option'
        );
      case 'FullInsurance':
        return this.translate.instant(
          'dashboard.deposit-settings.full-insurance-option'
        );
    }
  }

  createVehicleInsuranceDetailGroup(
    insuranceDetails: VehicleInsuranceDetail[]
  ): FormGroup[] {
    var insuranceDetailsGroup: FormGroup[] = [];
    insuranceDetails.forEach((insuranceDetail) => {
      insuranceDetailsGroup.push(
        new FormGroup({
          depositAmount: new FormControl(insuranceDetail.depositAmount),
          insurancePrice: new FormControl(insuranceDetail.insurancePrice),
          id: new FormControl(insuranceDetail.id),
          insuranceType: new FormControl(insuranceDetail.insuranceType),
          vehicleId: new FormControl(this.selectedVehicle.id),
          isActive: new FormControl<boolean>(insuranceDetail.isActive),
        })
      );
    });
    return insuranceDetailsGroup;
  }

  public get vehicleInsuranceDetails() {
    return <FormArray>this.depositSettingsForm.get('vehicleInsuranceDetails');
  }

  disableForm() {
    this.depositSettingsForm.disable();
    this.isFormDisabled = true;
  }

  enableForm() {
    this.depositSettingsForm.enable();
    this.isFormDisabled = false;
  }

  isFormReadyForSubmit(): boolean {
    return this.depositSettingsForm.valid && this.depositSettingsForm.dirty;
  }

  onVehicleSelected(event?: any, id?: number) {
    this.dashboardService
      .getVehicleById(event ? event.target.value : id)
      .subscribe((vehicle: Vehicle) => {
        this.selectedVehicle = vehicle;

        this.dashboardService
          .getVehicleInsuranceDetails(vehicle.id)
          .subscribe((vehicleInsuranceDetails: VehicleInsuranceDetail[]) => {
            this.vehicleInsuranceDetailsArray = vehicleInsuranceDetails;
            this.populateFormValues();
          });

        this.enableForm();
      });
  }

  populateFormValues() {
    const vehicleInsuranceDetailsGroups = this.createVehicleInsuranceDetailGroup(this.vehicleInsuranceDetailsArray);

    const populatedVehicleInsuranceDetailsArray = new FormArray(
      vehicleInsuranceDetailsGroups
    );
    this.depositSettingsForm.setControl(
      'vehicleInsuranceDetails',
      populatedVehicleInsuranceDetailsArray
    );
  }

  depositAmountChanged(index: number, event: any) {
    const newDepositAmount = parseFloat(event.target.value);
    const discountFormGroup = this.vehicleInsuranceDetails.controls[index] as FormGroup;
    const discountPercentageControl =
      discountFormGroup.get('depositAmount');
    if (discountPercentageControl.value !== null) {
      discountPercentageControl.setValue(newDepositAmount);
    }
    discountFormGroup.patchValue({ pricePerDay: newDepositAmount });
  }

  insurancePriceChanged(index: number, event: any) {
    const newInsurancePrice = parseFloat(event.target.value);
    const discountFormGroup = this.vehicleInsuranceDetails.controls[index] as FormGroup;
    const discountPercentageControl =
      discountFormGroup.get('insurancePrice');
    if (discountPercentageControl.value !== null) {
      discountPercentageControl.setValue(newInsurancePrice);
    }
    discountFormGroup.patchValue({ pricePerDay: newInsurancePrice });
  }

  getVehicleInsuranceDetailsUpdateModel(activeDetails: VehicleInsuranceDetail[]): VehicleInsuranceDetailsUpdateModel {
    const updateModel = new VehicleInsuranceDetailsUpdateModel();
    updateModel.vehicleId = this.selectedVehicle.id;

    activeDetails.forEach(detail => {
      detail.insuranceTypeId = detail.insuranceType.id;
    });

    updateModel.vehicleInsuranceDetails = activeDetails;

    return updateModel;
  }

  onSubmit() {
    this.dashboardService.updateVehicleInsuranceDetails(
      this.getVehicleInsuranceDetailsUpdateModel(this.vehicleInsuranceDetails.value)
    ).subscribe({
      next: () => {
        this.disableForm();
          this.onVehicleSelected(null, this.selectedVehicle.id);
          this.toastr.success(
            this.translate.instant('toastr.success.vehicle-edited')
          );
          this.depositSettingsForm.markAsPristine();
      },
      error: (error) => {
        this.toastr.error(
          this.translate.instant('toastr.error.try-again-or-contact')
        );
        console.log(error)
      },
    })
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
