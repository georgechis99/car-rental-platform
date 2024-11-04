import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { VehicleDetailsComponent } from './shop/vehicle-details/vehicle-details.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { SearchQueryParamsGuard } from './core/guards/search-query-params.guard';
import { CreateBookingComponent } from './booking/create-booking/create-booking.component';
import { TranslationsModule } from './shared/translations/translations.module';
import { ManageBookingComponent } from './booking/manage-booking/manage-booking.component';
import { BecomeARenterComponent } from './home/become-a-renter/become-a-renter.component';
import { TermsAndConditionsComponent } from './home/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './home/privacy-policy/privacy-policy.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search-results/:id', component: VehicleDetailsComponent },
  {
    path: 'search-results',
    component: ShopComponent,
    canActivate: [SearchQueryParamsGuard],
  },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'become-a-renter', component: BecomeARenterComponent},
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'not-found', component: NotFoundComponent },
  { path: 'booking', component: CreateBookingComponent },
  { path: 'manage-booking', component: ManageBookingComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslationsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
