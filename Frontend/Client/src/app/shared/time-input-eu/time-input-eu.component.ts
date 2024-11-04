import { Component, ElementRef, Input, Self, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-time-input-eu',
  templateUrl: './time-input-eu.component.html',
  styleUrls: ['./time-input-eu.component.scss']
})
export class TimeInputEuComponent {
  public hrs = [];
  public mins = ['00', '30'];
  public selectedQuantity: any = '2:00';

  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() label: string;
  isTooltipVisible: boolean = false;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  onChange(event) {}

  onTouched() {}

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
    this.selectedQuantity = obj;
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

  ngOnInit() {
    this.hrsData();
    this.selectedQuantity = this.controlDir.value;
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator
      ? [control.asyncValidator]
      : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  hrsData() {
    for (let i = 0; i <= 23; i++) {
      this.mins.forEach((minute) => {
        let str = `${i}:${minute}`;
        this.hrs.push(str);
      });
    }
  }
  getTime() {
  }
}
