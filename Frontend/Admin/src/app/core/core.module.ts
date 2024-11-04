import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TranslationsModule } from '../shared/translations/translations.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [NavBarComponent, NotFoundComponent, FooterComponent],
  imports: [CommonModule, RouterModule, TranslationsModule],
  exports: [NavBarComponent, FooterComponent],
})
export class CoreModule {}
