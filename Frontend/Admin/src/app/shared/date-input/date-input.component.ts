import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit,ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() label: string;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  isTooltipVisible: boolean = false;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator
      ? [control.asyncValidator]
      : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event) {}

  onTouched() {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getErrorMessage() {
    if (this.controlDir && this.controlDir.control && this.controlDir.control.touched) {
      const errors = this.controlDir.control.errors;
      if (errors) {
        if (errors['required']) {
          return `${this.label} is required!`;
        }else if (errors['tooSoon']) {
          return errors['tooSoon'];
        }
      }
    }
    return null;
  }

}
