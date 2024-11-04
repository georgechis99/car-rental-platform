import { Booking } from './../../shared/models/booking';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';
import { BookingService } from '../booking.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { ShopService } from 'src/app/shop/shop.service';
import { AccountService } from 'src/app/account/account.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { IVehicleInsuranceDetail } from 'src/app/shared/models/vehicle-insurance-details';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  bookingForm: FormGroup;
  vehicle: Vehicle;
  vehicleParams: VehicleParams = new VehicleParams();
  bookingSucceeded: boolean = false;
  bookingCreated: Booking;
  fullInsuranceCheckbox: boolean = false;
  limitedInsuranceCheckbox: boolean = true;
  noInsuranceCheckbox: boolean = false;
  noInsuranceExists: boolean = false;
  limitedInsuranceExists: boolean = false;
  fullInsuranceExists: boolean = false;
  babySeatCheckbox: boolean = false;
  cashCheckbox: boolean = false;
  cardCheckbox: boolean = false;
  ageVerificationCheckbox: boolean = false;
  termsAndConditionsCheckbox: boolean = false;
  marketingCheckbox: boolean = false;
  chosenInsuraceOption: IVehicleInsuranceDetail;

  constructor(
    private bookingService: BookingService,
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  currentUser$: Observable<User>;
  currentUser: User;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.loadVehicle();
    this.loadCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
    this.createLoginForm();
    this.accountService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.populateFormWithUserDetails();
      }
    });
  }

  loadVehicle() {
    this.getVehicleParamsForQuery();
    this.shopService
      .getDiscountedVehicle(
        +this.route.snapshot.queryParams['vehicleId'],
        this.vehicleParams.pickupDate,
        this.vehicleParams.dropoffDate,
        this.vehicleParams.pickupLocationId,
        this.vehicleParams.dropoffLocationId
      )
      .subscribe((vehicle: Vehicle) => {
        this.vehicle = vehicle;
        if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ) != null
        ) {
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          );
          this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
        } else if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ) != null
        ) {
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          );
          this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
        } else if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ) == null
        ) {
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          );
          this.bookingForm.patchValue({ insuranceOption: 'FullInsurance' });
        } else if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ) == null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ) != null
        ) {
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          );
          this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
        } else if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          ) != null
        ) {
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          );
          this.bookingForm.patchValue({ insuranceOption: 'NoInsurance' });
        } else {
          this.chosenInsuraceOption = null;
          this.bookingForm.patchValue({ insuranceOption: '' });
        }
        if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          ).isActive == true
        ) {
          this.noInsuranceExists = true;
        }
        if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          ).isActive == true
        ) {
          this.limitedInsuranceExists = true;
        }
        if (
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ) != null &&
          this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          ).isActive == true
        ) {
          this.fullInsuranceExists = true;
        }
      });
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe(
      () => {},
      (error) => {
        console.log(error);
      }
    );
  }

  createLoginForm() {
    this.bookingForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
      ]),
      wantInvoiceCheckbox: new FormControl(false),
      companyName: new FormControl(''),
      CUI: new FormControl(''),
      insuranceOption: new FormControl('', Validators.required),
      childSeatOption: new FormControl(false),
      paymentMethod: new FormControl('', Validators.required),
      ageVerification: new FormControl(false, Validators.requiredTrue),
      termsAndConditions: new FormControl(false, Validators.requiredTrue),
      marketingCheckbox: new FormControl(false),
    });

    this.bookingForm
      .get('wantInvoiceCheckbox')
      .valueChanges.subscribe((val) => {
        if (val == true) {
          this.bookingForm.controls['companyName'].setValidators([
            Validators.required,
          ]);
          this.bookingForm.controls['CUI'].setValidators([Validators.required]);
        } else {
          this.bookingForm.controls['companyName'].clearValidators();
          this.bookingForm.controls['CUI'].clearValidators();
        }
        this.bookingForm.controls['companyName'].updateValueAndValidity();
        this.bookingForm.controls['CUI'].updateValueAndValidity();
      });
  }

  populateFormWithUserDetails() {
    if (this.currentUser) {
      this.bookingForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phoneNumber: this.currentUser.phoneNumber,
      });
    }
  }

  populateBookingToCreate() {
    const bookingToCreate = new Booking();

    bookingToCreate.userEmail = this.bookingForm.value.email;
    bookingToCreate.firstName = this.bookingForm.value.firstName;
    bookingToCreate.lastName = this.bookingForm.value.lastName;
    bookingToCreate.phoneNumber = this.bookingForm.value.phoneNumber;
    if (this.bookingForm.value.wantInvoiceCheckbox) {
      bookingToCreate.companyName = this.bookingForm.value.companyName;
      bookingToCreate.CUI = this.bookingForm.value.CUI;
    }
    bookingToCreate.vehicleInsuranceDetails =
      this.bookingForm.value.insuranceOption;
    bookingToCreate.childSeatOption = this.bookingForm.value.childSeatOption;
    bookingToCreate.paymentMethod = this.bookingForm.value.paymentMethod;
    bookingToCreate.marketingCheckbox =
      this.bookingForm.value.marketingCheckbox;

    const vehicleId = this.route.snapshot.queryParams['vehicleId'];

    if (vehicleId) {
      return new Promise<Booking>((resolve, reject) => {
        this.shopService
          .getDiscountedVehicle(
            +vehicleId,
            this.vehicleParams.pickupDate,
            this.vehicleParams.dropoffDate,
            this.vehicleParams.pickupLocationId,
            this.vehicleParams.dropoffLocationId
          )
          .subscribe(
            (vehicle: Vehicle) => {
              this.vehicle = vehicle;
              bookingToCreate.vehicleId = this.vehicle.id;
              bookingToCreate.pickupDate = this.vehicleParams.pickupDate;
              bookingToCreate.dropoffDate = this.vehicleParams.dropoffDate;
              bookingToCreate.pickupLocationId =
                this.vehicleParams.pickupLocationId;
              bookingToCreate.dropoffLocationId =
                this.vehicleParams.dropoffLocationId;

              if (this.currentUser) {
                bookingToCreate.isGuest = false;
              } else {
                bookingToCreate.isGuest = true;
              }
              bookingToCreate.isApproved = false;

              if (this.bookingForm.value.wantInvoiceCheckbox) {
                bookingToCreate.companyName =
                  this.bookingForm.value.companyName;
                bookingToCreate.CUI = this.bookingForm.value.CUI;
              }

              bookingToCreate.vehicleInsuranceDetails =
                this.vehicle.vehicleInsuranceDetails.find(
                  (x) =>
                    x.insuranceType.name.toLowerCase() ==
                    this.bookingForm.value.insuranceOption.toLowerCase()
                );
              bookingToCreate.childSeatOption =
                this.bookingForm.value.childSeatOption;

              if (this.bookingForm.value.paymentMethod == 'Card') {
                bookingToCreate.paymentMethod = 1;
              }

              if (this.bookingForm.value.paymentMethod == 'Cash') {
                bookingToCreate.paymentMethod = 2;
              }

              bookingToCreate.marketingCheckbox =
                this.bookingForm.value.marketingCheckbox;
              bookingToCreate.promoCode = null;

              resolve(bookingToCreate);
            },
            (error) => {
              reject(error);
            }
          );
      });
    }

    // Return null if vehicleId is not available yet
    return null;
  }

  onSubmit() {
    const bookingToCreatePromise = this.populateBookingToCreate();
    if (bookingToCreatePromise) {
      bookingToCreatePromise
        .then((bookingToCreate: Booking) => {
          if (bookingToCreate.isGuest == true) {
            this.createGuestBooking(bookingToCreate);
          } else {
            this.createUserBooking(bookingToCreate);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  createUserBooking(bookingToCreate: Booking) {
    this.bookingService.createUserBooking(bookingToCreate).subscribe(
      () => {
        this.bookingSucceeded = true;
        this.bookingCreated = bookingToCreate;
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/not-found']);
        window.scrollTo(0, 0);
      }
    );
  }

  createGuestBooking(bookingToCreate: Booking) {
    this.bookingService.createGuestBooking(bookingToCreate).subscribe(
      () => {
        this.bookingSucceeded = true;
        this.bookingCreated = bookingToCreate;
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/not-found']);
        window.scrollTo(0, 0);
      }
    );
  }

  getVehicleParamsForQuery() {
    if (
      this.route.snapshot.queryParams['pickupDate'] &&
      this.route.snapshot.queryParams['dropoffDate'] &&
      this.route.snapshot.queryParams['pickupLocationId'] &&
      this.route.snapshot.queryParams['dropoffLocationId']
    ) {
      this.vehicleParams.pickupDate = new Date(
        this.route.snapshot.queryParams['pickupDate']
      );
      this.vehicleParams.dropoffDate = new Date(
        this.route.snapshot.queryParams['dropoffDate']
      );
      this.vehicleParams.pickupLocationId =
        this.route.snapshot.queryParams['pickupLocationId'];
      this.vehicleParams.dropoffLocationId =
        this.route.snapshot.queryParams['dropoffLocationId'];
      this.vehicleParams.pickupLocationName =
        this.route.snapshot.queryParams['pickupLocationName'];
      this.vehicleParams.dropoffLocationName =
        this.route.snapshot.queryParams['dropoffLocationName'];
    } else {
      this.router.navigate(['/not-found']);
      window.scrollTo(0, 0);
    }
  }

  fullInsuranceCheckboxChange($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ insuranceOption: 'FullInsurance' });
      this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
      );
      this.limitedInsuranceCheckbox = false;
      this.noInsuranceCheckbox = false;
    }
    if (!$event.target.checked) {
      if (
        this.limitedInsuranceCheckbox == false &&
        this.noInsuranceCheckbox == false
      ) {
        this.bookingForm.patchValue({ insuranceOption: '' });
        this.chosenInsuraceOption = null;
      } else {
        if (this.limitedInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          );
        }
        if (this.noInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'NoInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          );
        }
      }
    }
  }

  limitedInsuranceCheckboxChange($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
      this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
      );
      this.noInsuranceCheckbox = false;
      this.fullInsuranceCheckbox = false;
    }
    if (!$event.target.checked) {
      if (
        this.noInsuranceCheckbox == false &&
        this.fullInsuranceCheckbox == false
      ) {
        this.bookingForm.patchValue({ insuranceOption: '' });
        this.chosenInsuraceOption = null;
      } else {
        if (this.noInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'NoInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
          );
        }
        if (this.fullInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'FullInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          );
        }
      }
    }
  }

  noInsuranceCheckboxChange($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ insuranceOption: 'NoInsurance' });
      this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name.toLowerCase() == 'noinsurance'
      );
      this.limitedInsuranceCheckbox = false;
      this.fullInsuranceCheckbox = false;
    }
    if (!$event.target.checked) {
      if (
        this.limitedInsuranceCheckbox == false &&
        this.fullInsuranceCheckbox == false
      ) {
        this.bookingForm.patchValue({ insuranceOption: '' });
        this.chosenInsuraceOption = null;
      } else {
        if (this.limitedInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'LimitedInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'limitedinsurance'
          );
        }
        if (this.fullInsuranceCheckbox == true) {
          this.bookingForm.patchValue({ insuranceOption: 'FullInsurance' });
          this.chosenInsuraceOption = this.vehicle.vehicleInsuranceDetails.find(
            (x) => x.insuranceType.name.toLowerCase() == 'fullinsurance'
          );
        }
      }
    }
  }

  babySeatCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ childSeatOption: true });
    } else {
      this.bookingForm.patchValue({ childSeatOption: false });
    }
  }

  cashCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ paymentMethod: 'Cash' });
      this.cardCheckbox = false;
    }
    if (!$event.target.checked) {
      if (this.cardCheckbox == false) {
        this.bookingForm.patchValue({ paymentMethod: '' });
      } else {
        this.bookingForm.patchValue({ paymentMethod: 'Card' });
      }
    }
  }

  cardCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ paymentMethod: 'Card' });
      this.cashCheckbox = false;
    }
    if (!$event.target.checked) {
      if (this.cashCheckbox == false) {
        this.bookingForm.patchValue({ paymentMethod: '' });
      } else {
        this.bookingForm.patchValue({ paymentMethod: 'Cash' });
      }
    }
  }

  ageCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ ageVerification: true });
    } else {
      this.bookingForm.patchValue({ ageVerification: false });
    }
  }

  termsAndConditionsCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ termsAndConditions: true });
    } else {
      this.bookingForm.patchValue({ termsAndConditions: false });
    }
  }

  marketingCheckboxChanged($event) {
    if ($event.target.checked) {
      this.bookingForm.patchValue({ marketingCheckbox: true });
    } else {
      this.bookingForm.patchValue({ marketingCheckbox: false });
    }
  }
}
