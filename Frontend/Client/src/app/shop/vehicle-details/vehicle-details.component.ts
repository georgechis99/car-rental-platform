import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';
import { IInsuranceTableOption } from 'src/app/shared/models/insurance-table-option';
import { IVehicleInsuranceDetail } from 'src/app/shared/models/vehicle-insurance-details';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent implements OnInit {
  vehicle?: Vehicle;
  vehicleParams: VehicleParams = new VehicleParams();
  insuranceOptions: IInsuranceTableOption[] = [];
  noInsuranceExists: boolean = true;
  limitedInsuranceExists: boolean = false;
  fullInsuranceExists: boolean = false;
  averageInsuranceOption: IVehicleInsuranceDetail;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  initVariablesForDescription() {
    ///Don't forget to set collisionProtectionCoveredAmount and theftProtectionCoveredAmount
    this.insuranceOptions = [
      {
        description: 'shop.vehicle-details.insurance.table.options.1',
        noInsurance: false,
        limitedInsurance: true,
        fullInsurance: true,
      },
      {
        description: 'shop.vehicle-details.insurance.table.options.2',
        noInsurance: false,
        limitedInsurance: true,
        fullInsurance: true,
      },
      {
        description: 'shop.vehicle-details.insurance.table.options.3',
        noInsurance: false,
        limitedInsurance: false,
        fullInsurance: true,
      },
    ];
    for (let i = 0; i < this.vehicle.vehicleInsuranceDetails.length; i++) {
      if (
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name ==
          'NoInsurance' &&
        this.vehicle.vehicleInsuranceDetails[i].isActive == true
      ) {
        this.noInsuranceExists = true;
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name =
          'No Insurance';
      }
      if (
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name ==
          'LimitedInsurance' &&
        this.vehicle.vehicleInsuranceDetails[i].isActive == true
      ) {
        this.limitedInsuranceExists = true;
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name =
          'Limited Insurance';
      }
      if (
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name ==
          'FullInsurance' &&
        this.vehicle.vehicleInsuranceDetails[i].isActive == true
      ) {
        this.fullInsuranceExists = true;
        this.vehicle.vehicleInsuranceDetails[i].insuranceType.name =
          'Full Insurance';
      }
    }
    if (
      this.fullInsuranceExists == true &&
      this.limitedInsuranceExists == true
    ) {
      this.averageInsuranceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name == 'Limited Insurance'
      );
    } else if (
      this.fullInsuranceExists == true &&
      this.limitedInsuranceExists == false
    ) {
      this.averageInsuranceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name == 'Full Insurance'
      );
    } else if (
      this.fullInsuranceExists == false &&
      this.limitedInsuranceExists == true
    ) {
      this.averageInsuranceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name == 'Limited Insurance'
      );
    } else {
      this.averageInsuranceOption = this.vehicle.vehicleInsuranceDetails.find(
        (x) => x.insuranceType.name == 'No Insurance'
      );
    }
  }

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getVehiclesForQueryParams();
    if (id) {
      this.shopService
        .getDiscountedVehicle(
          +id,
          this.vehicleParams.pickupDate,
          this.vehicleParams.dropoffDate,
          this.vehicleParams.pickupLocationId,
          this.vehicleParams.dropoffLocationId
        )
        .subscribe({
          next: (vehicle) => {
            (this.vehicle = vehicle),
            this.initVariablesForDescription();
          },
          error: (error) => console.log(error),
        });
    }
  }

  getVehiclesForQueryParams() {
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

  continueToBook() {
    const queryParams = {
      vehicleId: this.vehicle.id,
      pickupDate: this.vehicleParams.pickupDate.toISOString(),
      dropoffDate: this.vehicleParams.dropoffDate.toISOString(),
      pickupLocationId: this.vehicleParams.pickupLocationId,
      dropoffLocationId: this.vehicleParams.dropoffLocationId,
      pickupLocationName: this.vehicleParams.pickupLocationName,
      dropoffLocationName: this.vehicleParams.dropoffLocationName,
    };

    // Navigate to ShopComponent with query parameters
    this.router.navigate(['/booking'], { queryParams });
    window.scrollTo(0, 0);
  }
}
