import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { TextInputComponent } from './text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerComponent } from './mat-datepicker/mat-datepicker.component';
import { TranslationsModule } from './translations/translations.module';
import { MatAutocompleteInputComponent } from './mat-autocomplete-input/mat-autocomplete-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { LocationInputComponent } from './location-input/location-input.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterDealsComponent } from './filter-deals/filter-deals.component';
import { LocalizedDatePipe } from './localized-date/localized-date.pipe';
import { PriceBreakdownComponent } from './price-breakdown/price-breakdown.component';
import { TimeInputEuComponent } from './time-input-eu/time-input-eu.component';
import { DateInputNgxComponent } from './date-input-ngx/date-input-ngx.component';
import { EuroCurrencyPipe } from './euro-currency/euro-currency.pipe';
import { ImportantInformationModalComponent } from './important-information-modal/important-information-modal.component';
import { ImportantInformationModalService } from './important-information-modal/important-information-modal.service';

@NgModule({
  declarations: [
    PagingHeaderComponent,
    TextInputComponent,
    MatDatepickerComponent,
    MatAutocompleteInputComponent,
    DateInputComponent,
    LocationInputComponent,
    TimeInputComponent,
    FilterDealsComponent,
    LocalizedDatePipe,
    PriceBreakdownComponent,
    TimeInputEuComponent,
    DateInputNgxComponent,
    EuroCurrencyPipe,
    ImportantInformationModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TranslationsModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  exports: [
    PagingHeaderComponent,
    TextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerComponent,
    MatAutocompleteInputComponent,
    DateInputComponent,
    LocationInputComponent,
    TimeInputComponent,
    FilterDealsComponent,
    LocalizedDatePipe,
    TranslationsModule,
    PriceBreakdownComponent,
    EuroCurrencyPipe
  ],
  providers: [
    ImportantInformationModalService
  ],
})
export class SharedModule {}
