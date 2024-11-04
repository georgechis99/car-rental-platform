import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalizedDatePipe } from 'src/app/shared/localized-date/localized-date.pipe';
import { VehicleParams } from 'src/app/shared/models/vehicle-params';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.scss'],
})
export class SearchSummaryComponent implements OnInit {
  @Input() vehicleParams?: VehicleParams;
  @Output() filterDealsSubmitted: EventEmitter<void> = new EventEmitter<void>();
  showAppFilterDeals: boolean = false;

  constructor() {
  }

  toggleContent(): void {
    this.showAppFilterDeals = !this.showAppFilterDeals;
  }

  filterDeals(){
    this.toggleContent();
    this.filterDealsSubmitted.emit();
  }

  ngOnInit(): void {}
}
