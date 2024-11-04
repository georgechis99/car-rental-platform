import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'euroCurrency',
  pure: false
})
export class EuroCurrencyPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(
    value: any,
    currencyCode: string = '€',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo: string = '1.2-2',
    lang: string = this.translateService.currentLang
  ): any {
    const currencyPipe: CurrencyPipe = new CurrencyPipe(lang);
    const formattedCurrency = currencyPipe.transform(value, currencyCode, display, digitsInfo);
    return formattedCurrency;
  }
}
