import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';

@Component({
  selector: 'app-booking-details-card',
  templateUrl: './booking-details-card.component.html',
  styleUrls: ['./booking-details-card.component.scss'],
})
export class BookingDetailsCardComponent implements OnInit {
  @Input() vehicleParams?: VehicleParams;

  constructor() {}

  ngOnInit(): void {}
}
