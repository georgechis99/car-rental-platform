import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslationsModule } from './translations/translations.module';
import { DateInputComponent } from './date-input/date-input.component';
import { TimeInputComponent } from './time-input/time-input.component';
import { LocalizedDatePipe } from './localized-date/localized-date.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LocationInputComponent } from './location-input/location-input.component';

@NgModule({
  declarations: [
    TextInputComponent,
    DateInputComponent,
    TimeInputComponent,
    LocalizedDatePipe,
    ConfirmationDialogComponent,
    LocationInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  exports: [
    TextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    DateInputComponent,
    TimeInputComponent,
    LocalizedDatePipe,
    LocationInputComponent
  ],
})
export class SharedModule {}
