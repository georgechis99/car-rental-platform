import { Component, Input } from '@angular/core';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';

@Component({
  selector: 'app-pickup-dropoff-summary',
  templateUrl: './pickup-dropoff-summary.component.html',
  styleUrls: ['./pickup-dropoff-summary.component.scss']
})
export class PickupDropoffSummaryComponent {
  @Input() vehicleParams?: VehicleParams;

  constructor() {}
}
