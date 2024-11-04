import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { TranslationsModule } from '../shared/translations/translations.module';
import { RouterModule } from '@angular/router';
import { BecomeARenterComponent } from './become-a-renter/become-a-renter.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    HomeComponent,
    BecomeARenterComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    TranslationsModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    HomeComponent,
    BecomeARenterComponent
  ]
})
export class HomeModule { }
