import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-bookings-calendar',
  templateUrl: './bookings-calendar.component.html',
  styleUrls: ['./bookings-calendar.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'YYYY-MM-DD' },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
  ],
})
export class BookingsCalendarComponent implements OnChanges {
  @ViewChild(MatCalendar) calendar: MatCalendar<Date>;

  @Input() bookings: Date[];
  @Input() unavailableDates: Date[];

  isCalendarDisabled: boolean;
  selectedDate: Date;
  @Output() onSelectedDate: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private dateAdapter: DateAdapter<Date>) {}

  onSelect(event){
    console.log(event);
    this.selectedDate = event;
    console.log(this.selectedDate);
    this.onSelectedDate.emit(this.selectedDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookings'] && this.calendar) {
      this.refreshCalendar();
    }

    if (changes['unavailableDates'] && this.calendar) {
      this.refreshCalendar();
    }

    if (changes['bookings'] || changes['unavailableDates']) {
      this.isCalendarDisabled = false;
    }
  }

  ngOnInit(): void {
    this.isCalendarDisabled = true;
    this.dateAdapter.setLocale(MAT_DATE_LOCALE);
    this.dateAdapter.getFirstDayOfWeek = () => 1;
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const isBooked = this.bookings.some((b) => this.isSameDate(b, date));
    const isUnavailable = this.unavailableDates.some((u) =>
      this.isSameDate(u, date)
    );

    // Check if the date has a day component (1-31)
    const hasDayComponent = date.getDate() !== 0;

    if (hasDayComponent) {
      if (isBooked) {
        return 'highlight';
      } else if (isUnavailable) {
        return 'unavailable';
      }
    } else {
      // Apply a different class for month cells
      return 'highlight-month';
    }

    return '';
  };

  isSameDate(date1: Date, date2: Date): boolean {
    const date1WithoutTime = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const date2WithoutTime = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    return date1WithoutTime.getTime() === date2WithoutTime.getTime();
  }

  refreshCalendar(): void {
    this.calendar.updateTodaysDate();
  }

}
