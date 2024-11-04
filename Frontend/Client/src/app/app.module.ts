import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ShopModule } from './shop/shop.module';
import { BookingModule } from './booking/booking.module';
import { registerLocaleData } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import localeRo from '@angular/common/locales/ro';
import localeDe from '@angular/common/locales/de';
import localeHu from '@angular/common/locales/hu';
import { SpinnerInterceptor } from './core/interceptors/http.interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountModule } from './account/account.module';

registerLocaleData(localeDe, 'de');
registerLocaleData(localeRo, 'ro');
registerLocaleData(localeDe, 'hu');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    ShopModule,
    BookingModule,
    AccountModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin-clockwise-fade' }),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    { provide: localeDe, useValue: 'de' },
    { provide: localeRo, useValue: 'ro' },
    { provide: localeHu, useValue: 'hu' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
