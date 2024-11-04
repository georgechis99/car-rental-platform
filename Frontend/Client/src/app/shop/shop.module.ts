import { TranslationsModule } from './../shared/translations/translations.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { VehicleItemComponent } from './vehicle-item/vehicle-item.component';
import { SharedModule } from '../shared/shared.module';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { ShopRoutingModule } from './shop-routing.module';
import { BookingDetailsCardComponent } from './booking-details-card/booking-details-card.component';
import { SearchSummaryComponent } from './search-summary/search-summary.component';


@NgModule({
  declarations: [
    ShopComponent,
    VehicleItemComponent,
    VehicleDetailsComponent,
    BookingDetailsCardComponent,
    SearchSummaryComponent,
  ],
  imports: [
    CommonModule,
    TranslationsModule,
    SharedModule,
    ShopRoutingModule,
  ],
  exports: [
    ShopComponent,
  ]
})
export class ShopModule { }
