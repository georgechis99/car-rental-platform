import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(
    value: any,
    format: string = 'EEEE, dd MMM yyyy',
    lang: string = this.translateService.currentLang
  ): any {
    const datePipe: DatePipe = new DatePipe(lang);
    const formattedDate = datePipe.transform(value, format);
    const formattedTime = datePipe.transform(value, 'HH:mm');

    if (formattedDate && format.includes('EEEE')) {
      const translatedDayOfWeek = this.translateDayOfWeek(value.getDay(), lang);
      return formattedDate.replace('EEEE', translatedDayOfWeek) + ', ' + formattedTime;
    }

    return formattedDate + ', ' + formattedTime;
  }

  private translateDayOfWeek(dayOfWeek: number, lang: string): string {
    const translationKey = `daysOfWeek.${dayOfWeek}`;
    const translatedDayOfWeek = this.translateService.instant(translationKey);
    const capitalizedDayOfWeek = translatedDayOfWeek.charAt(0).toUpperCase() + translatedDayOfWeek.slice(1);
    return capitalizedDayOfWeek;
  }
}
