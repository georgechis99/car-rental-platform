import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Vehicle } from 'src/app/shared/models/vehicle';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';
import { IVehicleInsuranceDetail } from '../models/vehicle-insurance-details';

@Component({
  selector: 'app-price-breakdown',
  templateUrl: './price-breakdown.component.html',
  styleUrls: ['./price-breakdown.component.scss'],
})
export class PriceBreakdownComponent implements OnInit, OnChanges {
  @Input() vehicle?: Vehicle;
  @Input() vehicleParams?: VehicleParams;
  @Input() _priceAddition: number = 0;
  @Input() _insuranceCost: number = 0;
  @Input() forBookingPage: boolean;
  @Input() insuranceOption: IVehicleInsuranceDetail;

  bookingPeriodDaysNumber = 0;
  _priceForPeriod = 0;
  _depositCost = 0;
  _totalPrice = 0;
  pickupDeliveryFee = 0;
  dropoffDeliveryFee = 0;

  ngOnInit(): void {
    this.bookingPeriodDaysNumber = this.calculateDays(
      this.vehicleParams.pickupDate,
      this.vehicleParams.dropoffDate
    );
    this.priceForPeriod = this.vehicle.totalPrice;
    this.pickupDeliveryFee = this.vehicle.pickupLocationDeliveryFee;
    this.dropoffDeliveryFee = this.vehicle.dropoffLocationDeliveryFee;

    this.priceAddition = this.priceAddition + this.pickupDeliveryFee + this.dropoffDeliveryFee;

    if (this.insuranceOption) {
      this.depositCost = this.insuranceOption.depositAmount;
      this.insuranceCost = this.insuranceOption.insurancePrice;
    } else if (this.vehicle) {
      this.depositCost = this.vehicle.baseDepositAmount;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insuranceOption']) {
      if (this.insuranceOption) {
        this.depositCost = this.insuranceOption.depositAmount;
        this.insuranceCost = this.insuranceOption.insurancePrice;
      } else if (this.vehicle) {
        this.depositCost = this.vehicle.baseDepositAmount;
        this.insuranceCost = 0;
      } else {
        this.depositCost = 0;
        this.insuranceCost = 0;
      }
    }
  }

  get priceForPeriod(): number {
    return this._priceForPeriod;
  }

  get insuranceCost(): number {
    return this._insuranceCost;
  }

  get depositCost(): number {
    return this._depositCost;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get priceAddition(): number {
    return this._priceAddition;
  }

  set priceForPeriod(value: number) {
    this._priceForPeriod = value;
    this._totalPrice =
      value + this._insuranceCost + this._depositCost + this._priceAddition;
  }

  set insuranceCost(value: number) {
    this._insuranceCost = value;
    this._totalPrice =
      this._priceForPeriod + value + this._depositCost + this._priceAddition;
  }

  set depositCost(value: number) {
    this._depositCost = value;
    this._totalPrice =
      this._priceForPeriod + this._insuranceCost + value + this._priceAddition;
  }

  set priceAddition(value: number) {
    this._priceAddition = value;
    this._totalPrice =
      this._priceForPeriod + this._insuranceCost + this._depositCost + value;
  }

  calculateDays(startDate: Date, endDate: Date): number {
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    // Check if the end date hour is more than 4 hours after the start date hour
    if (endDate.getHours() - startDate.getHours() >= 4) {
      // Add one more day to the result
      end.setDate(end.getDate() + 1);
    }

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return days;
  }
}
