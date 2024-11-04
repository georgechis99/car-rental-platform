import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;
  @Input() disabled = false;

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator
      ? [control.asyncValidator]
      : [];

    if (this.type === 'numeric' || this.type === 'integer') {
      validators.push(this.validateNumbers);
    }

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event) {}

  onTouched() {}

  writeValue(obj: any): void {
    if (this.type === 'numeric') {
      if (typeof obj === 'number' && !isNaN(obj)) {
        this.input.nativeElement.value = obj.toFixed(1);
      }
    } else if (this.type === 'integer') {
      if (typeof obj === 'number' && !isNaN(obj)) {
        this.input.nativeElement.value = obj.toFixed(0);
      }
    } else {
      this.input.nativeElement.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validateNumbers(control: FormControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && isNaN(value)) {
      return { notANumber: true };
    }
    if (value !== null && value < 0) {
      return { negativeNumber: true };
    }
    return null;
  }
}
