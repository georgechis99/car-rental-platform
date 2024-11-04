import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { VehicleLocation } from '../models/vehicle-location';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;
  @ViewChild('dropdown', { static: true }) dropdown: ElementRef<HTMLDivElement>;
  @Input() placeholder: string;
  @Input() label: string;
  isTooltipVisible: boolean = false;
  vehicleLocations: VehicleLocation[] = [];

  constructor(
    @Self() public controlDir: NgControl,
    private dashboardService: DashboardService
  ) {
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

    this.getLocations();
  }

  getLocations() {
    this.dashboardService.getLocations().subscribe({
      next: (response) => (this.vehicleLocations = response),
      error: (error) => console.log(error),
    });
  }

  onChange(event) {}

  onTouched() {}

  writeValue(obj: any): void {
    const locationName = obj ? obj : '';
    this.input.nativeElement.value = locationName;
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  const targetNode = event.target as Node;

  if (
    !this.dropdown.nativeElement.contains(targetNode) &&
    !this.input.nativeElement.contains(targetNode)
  ) {
    this.closeDropdown();
  }
}

  closeDropdown(): void {
    this.dropdown.nativeElement.style.display = 'none';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getErrorMessage() {
    if (
      this.controlDir &&
      this.controlDir.control &&
      this.controlDir.control.touched
    ) {
      const errors = this.controlDir.control.errors;
      if (errors) {
        if (errors['required']) {
          return `${this.label} is required!`;
        }
      }
    }
    return null;
  }

  onInputChange(event) {
    const inputValue = event.value;

    if (inputValue.length >= 0) {
      const matches = this.vehicleLocations.filter(
        (option) =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
      );

      if (matches.length) {
        // Only create the dropdown if there are matches
        this.dropdown.nativeElement.innerHTML = '';
        matches.forEach((option) => {
          const link = document.createElement('a');

          // Create a <div> element for name and address
          const nameDiv = document.createElement('div');
          nameDiv.textContent = option.name;

          const addressDiv = document.createElement('div');
          addressDiv.textContent = option.address;

          // Add event listener to the link
          link.addEventListener('click', () => {
            this.onOptionSelected(option);
            this.dropdown.nativeElement.style.display = 'none';
          });

          // Append name and address divs to the link
          link.appendChild(nameDiv);
          link.appendChild(addressDiv);

          this.dropdown.nativeElement.appendChild(link);
        });

        this.dropdown.nativeElement.style.display = 'block';
      } else {
        this.dropdown.nativeElement.style.display = 'none';
      }
    } else {
      this.dropdown.nativeElement.style.display = 'none';
    }
  }

  onOptionSelected(option) {
  // Set the input value to the selected option name
  this.input.nativeElement.value = option.name;

  // Hide the dropdown
  this.dropdown.nativeElement.style.display = 'none';

  // Call onChange with selected option id and name
  this.onChange({ id: option.id, name: option.name });
}

  onInputMouseEnter() {
    const inputValue = this.input.nativeElement.value;
    const dropdown = this.dropdown.nativeElement;
    if (
      inputValue.length > 0 &&
      this.vehicleLocations.length > 0 &&
      this.controlDir.control.touched
    ) {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
  }

  onInputMouseLeave() {
    const dropdown = this.dropdown.nativeElement;
    dropdown.style.display = 'none';
  }
}
