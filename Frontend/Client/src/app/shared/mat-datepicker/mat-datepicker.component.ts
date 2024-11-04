import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mat-datepicker',
  templateUrl: './mat-datepicker.component.html',
  styleUrls: ['./mat-datepicker.component.scss'],
})
export class MatDatepickerComponent {
  @Input() placeholder: string;
}
