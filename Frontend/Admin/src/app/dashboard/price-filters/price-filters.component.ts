import { Discount } from './../../shared/models/discount';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { AccountService } from 'src/app/account/account.service';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { VehicleDetails } from 'src/app/shared/models/vehicleDetails';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DiscountsUpdateModel } from 'src/app/shared/models/discountsUpdateModel';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-price-filters',
  templateUrl: './price-filters.component.html',
  styleUrls: ['./price-filters.component.scss'],
})
export class PriceFiltersComponent {
  priceFiltersForm: FormGroup;
  currentUser$: Observable<User>;
  vehicleDetails: { name: string; value: string }[];
  selectedVehicle: Vehicle;
  discountsArray: Discount[];
  seasonDiscountsArray: Discount[];
  discountSelectedValue: number = 0;

  public isFormDisabled = true;

  months = [
    { name: 'Jan', number: 1 },
    { name: 'Feb', number: 2 },
    { name: 'Mar', number: 3 },
    { name: 'Apr', number: 4 },
    { name: 'May', number: 5 },
    { name: 'Jun', number: 6 },
    { name: 'Jul', number: 7 },
    { name: 'Aug', number: 8 },
    { name: 'Sep', number: 9 },
    { name: 'Oct', number: 10 },
    { name: 'Nov', number: 11 },
    { name: 'Dec', number: 12 },
  ];

  getMonthName(monthNumber: number): string {
    const month = this.months.find((m) => m.number === monthNumber);
    return month ? month.name : '';
  }

  constructor(
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.createPriceFiltersForm();
    this.disableForm();
    this.toastr.toastrConfig.positionClass = 'custom-toast';
  }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe((user: User) => {
      const ownerEmail = user.email;
      this.getVehicleDetailsForOwner(ownerEmail);
    });
  }

  createPriceFiltersForm() {
    this.priceFiltersForm = new FormGroup({
      pricePerDay: new FormControl(''),
      deposit: new FormControl(''),
      extraKm: new FormControl(''),
      canLeaveCountry: new FormControl<boolean>(null),
      discounts: new FormArray<FormGroup>([]),
      seasonDiscounts: new FormArray<FormGroup>([]),
    });
  }

  createDiscountGroupFromObject(discount: Discount): FormGroup {
    const {
      intervalStartInDays,
      discountPercentage,
      intervalEndInDays,
      id,
      discountType,
      vehicleId,
    } = discount;

    return new FormGroup({
      intervalStartInDays: new FormControl(intervalStartInDays),
      discountPercentage: new FormControl(discountPercentage),
      pricePerDay: new FormControl(
        this.calculateDiscountedPrice(
          this.selectedVehicle?.price || 0,
          discountPercentage
        )
      ),
      intervalEndInDays: new FormControl(intervalEndInDays),
      id: new FormControl(id || null),
      discountType: new FormControl(discountType || null),
      vehicleId: new FormControl(vehicleId || null),
    });
  }

  createSeasonDiscountGroupFromObject(discount: Discount): FormGroup {
    return new FormGroup({
      month: new FormControl(discount.month),
      discountPercentage: new FormControl(discount.discountPercentage),
      id: new FormControl(discount.id ?? null), // Initialize id property
      discountType: new FormControl(discount.discountType ?? null), // Initialize discountType property
      intervalStartInDays: new FormControl(
        discount.intervalStartInDays ?? null
      ), // Initialize intervalStartInDays property
      intervalEndInDays: new FormControl(discount.intervalEndInDays ?? null), // Initialize intervalEndInDays property
      vehicleId: new FormControl(discount.vehicleId ?? null), // Initialize vehicleId property
    });
  }

  calculateDiscountedPrice(price: number, discountPercentage: number) {
    var discountedPrice = price - discountPercentage * 0.01 * price;
    return discountedPrice >= 0 ? discountedPrice : 0;
  }

  calculateDiscountPercentage(price: number, discountedPrice: number) {
    return (100 * (price - discountedPrice)) / price;
  }

  startingWithChanged(index: number, event: any) {
    const newStartingWith = parseInt(event.target.value);

    const discountFormGroup = this.discounts.controls[index] as FormGroup;
    const startingWithControl = discountFormGroup.get('intervalStartInDays');
    const endingWithControl = discountFormGroup.get('intervalEndInDays');

    if (startingWithControl.value !== null) {
      startingWithControl.setValue(newStartingWith);
    }

    // Update the interval end in days of the previous discount
    if (index > 0) {
      const previousDiscountFormGroup = this.discounts.controls[
        index - 1
      ] as FormGroup;
      const previousEndingWithControl =
        previousDiscountFormGroup.get('intervalEndInDays');

      const startingWith = parseInt(startingWithControl.value);

      if (startingWith <= parseInt(previousEndingWithControl.value)) {
        previousEndingWithControl.setValue(startingWith - 1);
      }

      if (startingWith > parseInt(previousEndingWithControl.value + 1)) {
        previousEndingWithControl.setValue(startingWith - 1);
      }
    }

    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  pricePerDayChanged(index: number, event: any) {
    const newPricePerDay = parseFloat(event.target.value);
    const discountFormGroup = this.discounts.controls[index] as FormGroup;
    const discountPercentageControl =
      discountFormGroup.get('discountPercentage');

    if (discountPercentageControl.value !== null) {
      const newDiscount = this.calculateDiscountPercentage(
        this.selectedVehicle.price,
        newPricePerDay
      );
      discountPercentageControl.setValue(newDiscount);
    }

    discountFormGroup.patchValue({ pricePerDay: newPricePerDay });
  }

  basePricePerDayChanged(event: any) {
    const newPricePerDay = parseFloat(event.target.value);
    this.selectedVehicle.price = newPricePerDay;

    // Loop through each discount and update the pricePerDay based on new base price
    this.discounts.controls.forEach((control) => {
      const discountPercentage = control.get('discountPercentage').value;
      const newDiscountedPrice = this.calculateDiscountedPrice(
        newPricePerDay,
        discountPercentage
      );
      control.patchValue({ pricePerDay: newDiscountedPrice });
    });

    this.priceFiltersForm.patchValue({
      pricePerDay: newPricePerDay,
    });

    // Update the pricePerDay value in each discount based on the new value
    this.discounts.controls.forEach((control, i) => {
      const discountPercentage = control.get('discountPercentage').value;
      const newDiscountedPrice = this.calculateDiscountedPrice(
        newPricePerDay,
        discountPercentage
      );
      control.patchValue({ pricePerDay: newDiscountedPrice });
    });

    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  depositChanged(event: any) {
    const newDeposit = parseFloat(event.target.value);
    this.priceFiltersForm.patchValue({
      deposit: newDeposit,
    });
    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  extraKmChanged(event: any) {
    const newExtraKm = parseFloat(event.target.value);
    this.priceFiltersForm.patchValue({
      extraKm: newExtraKm,
    });
    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  discountPercentageChanged(index: number, event: any) {
    const newDiscount = parseFloat(event.target.value);
    const discountFormGroup = this.discounts.controls[index] as FormGroup;
    const pricePerDayControl = discountFormGroup.get('pricePerDay');

    if (pricePerDayControl.value !== null) {
      const newPricePerDay = this.calculateDiscountedPrice(
        this.selectedVehicle.price,
        newDiscount
      );
      pricePerDayControl.setValue(newPricePerDay);
    }

    discountFormGroup.patchValue({ discountPercentage: newDiscount });
    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  seasonDiscountChanged(index: number, event: any) {
    const newSeasonDiscount = parseFloat(event.target.value);
    const discountFormGroup = this.seasonDiscounts.controls[index] as FormGroup;
    const discountPercentageControl =
      discountFormGroup.get('discountPercentage');

    if (discountPercentageControl.value !== null) {
      discountPercentageControl.setValue(newSeasonDiscount);
      discountFormGroup.get('discountType').setValue(2);
      discountFormGroup.get('intervalStartInDays').setValue(0);
      discountFormGroup.get('intervalEndInDays').setValue(2);
      discountFormGroup.get('vehicleId').setValue(this.selectedVehicle.id);
    }

    discountFormGroup.patchValue({ discountPercentage: newSeasonDiscount });
    this.seasonDiscountsArray = this.seasonDiscounts.controls.map(
      (control) => control.value
    );
  }

  calculateStartingWithDays(selectedDays: number[], index: number): number[] {
    const allDays = Array.from({ length: 30 }, (_, i) => i + 1);

    if (selectedDays.length === 0) {
      return allDays;
    }

    const previousDays = selectedDays.slice(0, index);
    const maxPreviousDay = Math.max(...previousDays);

    const nextDays = selectedDays.slice(index + 1);
    const minNextDay = Math.min(...nextDays);

    if (minNextDay <= maxPreviousDay + 1) {
      return [];
    }

    return allDays.slice(maxPreviousDay, minNextDay - 1);
  }

  public getSelectedDaysArray(): number[] {
    return this.discounts.controls.map(
      (control) => control.value.intervalStartInDays
    );
  }

  public get discounts() {
    return <FormArray>this.priceFiltersForm.get('discounts');
  }

  public get seasonDiscounts() {
    return <FormArray>this.priceFiltersForm.get('seasonDiscounts');
  }

  addDiscount() {
    const selectedDays = this.getSelectedDaysArray();
    const maxSelectedDay = Math.max(...selectedDays);

    if (maxSelectedDay >= 30) {
      return;
    }

    const newIntervalStartDay = maxSelectedDay + 1;
    const availableDays = this.calculateStartingWithDays(
      selectedDays,
      selectedDays.length
    );

    if (availableDays.length === 0) {
      return;
    }

    const newDiscount = new Discount();
    newDiscount.intervalStartInDays = newIntervalStartDay;
    newDiscount.discountType = 1;
    newDiscount.intervalEndInDays = 30;
    newDiscount.discountPercentage = 0;
    newDiscount.vehicleId = this.selectedVehicle.id;

    this.discounts.push(this.createDiscountGroupFromObject(newDiscount));

    this.priceFiltersForm.markAsDirty();

    const discountFormGroup = this.discounts.controls[
      this.discounts.length - 1
    ] as FormGroup;
    const startingWithControl = discountFormGroup.get('intervalStartInDays');
    const startingWith = parseInt(startingWithControl.value);

    const previousDiscountFormGroup = this.discounts.controls[
      this.discounts.length - 2
    ] as FormGroup;

    if (previousDiscountFormGroup) {
      const previousEndingWithControl =
        previousDiscountFormGroup.get('intervalEndInDays');

      if (startingWith <= parseInt(previousEndingWithControl.value)) {
        previousEndingWithControl.setValue(startingWith - 1);
      }
    }

    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  removeDiscount(i: number) {
    if (i != 0) {
      const previousDiscountFormGroup = this.discounts.controls[
        i - 1
      ] as FormGroup;
      const previousEndingWithControl =
        previousDiscountFormGroup.get('intervalEndInDays');
      const discountFormGroup = this.discounts.controls[i] as FormGroup;
      const startingWithControl = discountFormGroup.get('intervalStartInDays');

      if (i === this.discounts.length - 1) {
        previousEndingWithControl.setValue(30);
      } else {
        previousEndingWithControl.setValue(startingWithControl.value);
      }
    }

    this.discounts.removeAt(i);
    this.priceFiltersForm.markAsDirty();

    this.discountsArray = this.discounts.controls.map(
      (control) => control.value
    );
  }

  getDiscountsFromFormSeasonDiscounts(seasonDiscounts: Discount[]) {
    var discounts = seasonDiscounts.map((seasonDiscount) => {});
  }

  getDiscountsUpdateModel(formValue: any): DiscountsUpdateModel {
    const updateModel = new DiscountsUpdateModel();
    updateModel.vehicleId = this.selectedVehicle.id;
    updateModel.canLeaveCountry = formValue.canLeaveCountry;
    updateModel.baseDepositAmount = formValue.deposit;
    updateModel.price = formValue.pricePerDay;
    updateModel.extra100KmPrice = formValue.extraKm;

    updateModel.discounts = this.discountsArray;
    updateModel.discounts = updateModel.discounts.concat(
      this.seasonDiscountsArray.filter(
        (discount) => discount.discountPercentage !== 0
      )
    );

    return updateModel;
  }

  onSubmit() {
    this.dashboardService
      .updateDiscounts(
        this.getDiscountsUpdateModel(this.priceFiltersForm.value)
      )
      .subscribe({
        next: () => {
          this.disableForm();
          this.onVehicleSelected(null, this.selectedVehicle.id);
          this.toastr.success(
            this.translate.instant('toastr.success.vehicle-edited')
          );
          this.priceFiltersForm.markAsPristine();
        },
        error: (error) => {
          this.toastr.error(
            this.translate.instant('toastr.error.try-again-or-contact')
          );
        },
      });
  }

  onVehicleSelected(event?: any, id?: number) {
    this.dashboardService
      .getVehicleById(event ? event.target.value : id)
      .subscribe((vehicle: Vehicle) => {
        this.selectedVehicle = vehicle;

        this.dashboardService
          .getIntervalDiscountsForVehicle(vehicle.id)
          .subscribe((discounts: Discount[]) => {
            this.discountsArray = discounts;
            this.dashboardService
              .getMonthDiscountsForVehicle(vehicle.id)
              .subscribe((monthDiscounts: Discount[]) => {
                this.seasonDiscountsArray = monthDiscounts;
                this.populateFormValues(this.selectedVehicle);
              });
          });

        this.enableForm();
      });
  }

  findSeasonDiscountByMonth(monthNumber) {
    return (
      this.seasonDiscountsArray.find(
        (discount) => discount.month === monthNumber
      ) || null
    );
  }

  generateDiscountValues(seasonDiscount: AbstractControl) {
    const discountValues = [];

    // Include the current seasonDiscount's discount percentage
    const discountPercentage = seasonDiscount.get('discountPercentage').value;
    discountValues.push(discountPercentage);

    // Add all values between -100 and 100
    for (let value = -100; value <= 100; value++) {
      if (!discountValues.includes(value)) {
        discountValues.push(value);
      }
    }

    return discountValues.sort((a, b) => a - b);
  }

  populateFormValues(vehicle: Vehicle) {
    this.priceFiltersForm.patchValue({
      pricePerDay: vehicle.price,
      deposit: vehicle.baseDepositAmount,
      extraKm: vehicle.extra100KmPrice,
      canLeaveCountry: vehicle.canLeaveCountry,
    });

    const discountsArray = this.discountsArray.map((discount) =>
      this.createDiscountGroupFromObject(discount)
    );
    const newDiscountsArray = new FormArray(discountsArray);
    this.priceFiltersForm.setControl('discounts', newDiscountsArray);

    const seasonDiscountsArray = this.months.map((month) => {
      const foundSeasonDiscount = this.findSeasonDiscountByMonth(month.number);
      const discountValue = foundSeasonDiscount
        ? foundSeasonDiscount.discountPercentage
        : 0;

      const seasonDiscount = new Discount();
      seasonDiscount.month = month.number;
      seasonDiscount.discountPercentage = discountValue;
      seasonDiscount.id = foundSeasonDiscount ? foundSeasonDiscount.id : null;
      seasonDiscount.discountType = foundSeasonDiscount
        ? foundSeasonDiscount.discountType
        : null;
      seasonDiscount.intervalEndInDays = foundSeasonDiscount
        ? foundSeasonDiscount.intervalEndInDays
        : null;
      seasonDiscount.intervalStartInDays = foundSeasonDiscount
        ? foundSeasonDiscount.intervalStartInDays
        : null;
      seasonDiscount.vehicleId = foundSeasonDiscount
        ? foundSeasonDiscount.vehicleId
        : null;

      return this.createSeasonDiscountGroupFromObject(seasonDiscount);
    });

    const newSeasonDiscountsArray = new FormArray(seasonDiscountsArray);
    this.priceFiltersForm.setControl(
      'seasonDiscounts',
      newSeasonDiscountsArray
    );
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

  disableForm() {
    this.priceFiltersForm.disable();
    this.isFormDisabled = true;
  }

  enableForm() {
    this.priceFiltersForm.enable();
    this.isFormDisabled = false;
  }

  isFormReadyForSubmit(): boolean {
    return this.priceFiltersForm.valid && this.priceFiltersForm.dirty;
  }

  generateRange(start: number, end: number, step: number): number[] {
    const range = [];
    for (let i = start; i <= end; i += step) {
      range.push(i);
    }
    return range;
  }
}
