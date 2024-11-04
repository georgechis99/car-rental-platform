import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      defaultLanguage: 'ro',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true
    }),
  ],
  exports: [
    TranslateModule
  ]
})
export class LazyTranslationsModule {
  constructor(protected translateService: TranslateService) {
    const currentLang = localStorage.getItem('selectedLanguage'); // Get the selected language from local storage
    if (currentLang) {
      translateService.setDefaultLang(currentLang); // Set the selected language as the default language
      translateService.use(currentLang); // Use the selected language
    }
  }
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}