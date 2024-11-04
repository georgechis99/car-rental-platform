import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit{
  bookingForm: FormGroup;

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.bookingForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
      ]),
    });
  }

  onSubmit() {
    // this.accountService.login(this.loginForm.value).subscribe(
    //   () => {
    //     this.router.navigateByUrl('');
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}
