import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AsyncValidatorFn, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { timer, switchMap, of, map } from 'rxjs';
import { AccountService } from '../account.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];
  termsAndConditionsCheckbox: boolean = false;
  marketingCheckbox: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.addEventListener("load", function() {
      const columnsContainer = document.getElementById("columnsContainer");
      const contentColumn = columnsContainer.children[0] as HTMLImageElement; // Cast to HTMLImageElement
      const imageColumn = columnsContainer.children[1] as HTMLImageElement; // Cast to HTMLImageElement
      
      function adjustImageSize() {
        const contentHeight = contentColumn.naturalHeight;
        imageColumn.style.height = contentHeight + "px";
      }
      
      adjustImageSize();
      window.addEventListener("resize", adjustImageSize);
    });
    
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl(null,[Validators.required,Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],[this.validateEmailNotTaken()]),
      password: new FormControl(null,[Validators.required],[this.validatePasswordPattern()]),
      termsAndConditions: new FormControl(false, [Validators.requiredTrue]),
      marketingCheckbox: new FormControl(false, [Validators.nullValidator],[]),
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigateByUrl('');
      },
      (error) => {
        console.log(error);
        this.errors = error.errors;
      }
    );
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }

  validatePasswordPattern(): AsyncValidatorFn {
    return (control) => {
      const passwordPattern =
        /^(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).*$/;
      const isMatch = passwordPattern.test(control.value);
      return of(isMatch ? null : { invalidPassword: true });
    };
  }

  termsAndConditionsCheckboxChanged($event){
    if($event.target.checked){
      this.registerForm.patchValue({termsAndConditions: true});
    }
    else{
      this.registerForm.patchValue({termsAndConditions: false});
    }
  }

  marketingCheckboxChanged($event){
    if($event.target.checked){
      this.registerForm.patchValue({marketingCheckbox: true});
    }
    else{
      this.registerForm.patchValue({marketingCheckbox: false});
    }
  }
}
