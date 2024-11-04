import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ImportantInformationModalService } from 'src/app/shared/important-information-modal/important-information-modal.service';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';

@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss']
})

export class VehicleItemComponent implements OnInit {
  @Input() vehicle?: Vehicle;
  @Input() vehicleParams?: VehicleParams;
  bookingPeriodDaysNumber = 0;
  priceForPeriod = 0;
  deliveryFee = 0;
  oldPrice = 0;
  @Input() isSearchPage?: boolean;
  numberOfReviews = 0;

  faCheck = faCheck;

  constructor(private router: Router,private modalService: ImportantInformationModalService){}

  ngOnInit(): void {
    this.bookingPeriodDaysNumber = this.calculateDays(this.vehicleParams.pickupDate, this.vehicleParams.dropoffDate);
    this.priceForPeriod = this.vehicle.totalPrice;
    this.oldPrice = this.vehicle.totalPriceWithoutDiscounts;

    if(this.vehicle.pickupLocationDeliveryFee)
      this.deliveryFee += this.vehicle.pickupLocationDeliveryFee;
    if(this.vehicle.dropoffLocationDeliveryFee)
      this.deliveryFee += this.vehicle.dropoffLocationDeliveryFee;
  }

  onShowVehicleDetails() {
    const queryParams = {
      pickupDate: this.vehicleParams.pickupDate.toISOString(),
      dropoffDate: this.vehicleParams.dropoffDate.toISOString(),
      pickupLocationId: this.vehicleParams.pickupLocationId,
      dropoffLocationId: this.vehicleParams.dropoffLocationId,
      pickupLocationName: this.vehicleParams.pickupLocationName,
      dropoffLocationName: this.vehicleParams.dropoffLocationName
    };

    this.router.navigate(['/search-results', this.vehicle.id], { queryParams });
    window.scrollTo(0, 0);
  }

  calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // Check if the end date hour is more than 4 hours after the start date hour
    if (endDate.getHours() - startDate.getHours() >= 4) {
        // Add one more day to the result
        end.setDate(end.getDate() + 1);
    }

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return days;
  }

  modalButtonClicked() {
    this.modalService.confirm('lg');
  }
}
