import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  showLanguageDropdown: boolean = false;

  constructor(private accountService: AccountService, private translate: TranslateService) {}

  currentUser$: Observable<User>;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe(
      () => {},
      (error) => {
        console.log(error);
      }
    );
  }

  toggleDropdown() {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  selectLanguage(language: string) {
    this.translate.setDefaultLang(language); // Set selected language as default
    this.translate.use(language); // Use selected language
    localStorage.setItem('selectedLanguage', language); // Store selected language in localStorage
  }
}