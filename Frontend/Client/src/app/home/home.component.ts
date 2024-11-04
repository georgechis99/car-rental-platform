import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { User } from '../shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private accountService: AccountService,private router: Router) {}

  currentUser$: Observable<User>;

  logout() {
    this.accountService.logout();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
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

  showBecomeARenterPage(){
    this.router.navigate(['/become-a-renter']);
    window.scrollTo(0, 0);
  }
}
