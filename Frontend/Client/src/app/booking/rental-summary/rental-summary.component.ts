import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-rental-summary',
  templateUrl: './rental-summary.component.html',
  styleUrls: ['./rental-summary.component.scss'],
})
export class RentalSummaryComponent implements OnInit {
  @Input() vehicle: Vehicle;
  @Input() vehicleParams: VehicleParams;

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.initVehicle();
  }

  initVehicle() {
    const vehicleId = this.route.snapshot.queryParams['vehicleId'];
    this.shopService
      .getDiscountedVehicle(
        +vehicleId,
        this.vehicleParams.pickupDate,
        this.vehicleParams.dropoffDate,
        this.vehicleParams.pickupLocationId,
        this.vehicleParams.dropoffLocationId
      )
      .subscribe((vehicle: Vehicle) => {
        this.vehicle = vehicle;
      });
  }
}
