import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Rent-My-Car';

  constructor(private accountService: AccountService, private translate: TranslateService, private router: Router) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
  }
}
