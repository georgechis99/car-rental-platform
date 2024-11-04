import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BecomeARenterService } from './become-a-renter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-a-renter',
  templateUrl: './become-a-renter.component.html',
  styleUrls: ['./become-a-renter.component.scss']
})
export class BecomeARenterComponent implements OnInit{
  registerSuccess: boolean = false;
  registerError: boolean = false;

  constructor(private becomeARenterService: BecomeARenterService,private router:Router) {}

  ngOnInit(): void {
    this.createPersonalInformationForm();
  }

  PersonalInformationForm: FormGroup;

  onBecomeARenterClick(): void {
    this.becomeARenterService.registerNewRenter(this.PersonalInformationForm.value.fullName, this.PersonalInformationForm.value.email, this.PersonalInformationForm.value.phoneNumber).subscribe(response => {
      this.registerSuccess = true;
      this.registerError = false;
    }, error => {
      console.log(error);
      this.registerSuccess = false;
      this.registerError = true;
    });
    this.createPersonalInformationForm();
  }

  createPersonalInformationForm(){
    this.PersonalInformationForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Za-zĂăÂâȘșȚțÎî\-]+ [A-Za-zĂăÂâȘșȚțÎî\-]+$')
      ]),
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

  onBackToHomeClick(){
    this.registerSuccess = false;
    this.registerError = false;
    this.router.navigate(['/']);
  }

  onRetrySubmissionClick(){
    this.registerSuccess = false;
    this.registerError = false;
  }
}

