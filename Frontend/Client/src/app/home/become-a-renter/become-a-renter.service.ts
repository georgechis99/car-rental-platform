import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BecomeARenterService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerNewRenter(fullName: string, email: string, phoneNumber: string) {
    const parameters = {
      'FullName': '',
      'Email': '',
      'PhoneNumber': ''
    }
    if(this.validateFullName(fullName)){
      parameters.FullName = fullName;
    }
    if(this.validateEmail(email)){
      parameters.Email = email;
    }
    if(this.validatePhoneNumber(phoneNumber)){
      parameters.PhoneNumber = phoneNumber;
    }

    return this.http.get(this.baseUrl + 'account/registernewrenter', {params: parameters});
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+?\d+$/;
    return phoneRegex.test(phoneNumber);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateFullName(fullName: string): boolean {
    const nameParts = fullName.trim().split(' ');

    if (nameParts.length < 2) {
      return false;
    }

    const specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const hasSpecialCharacters = nameParts.some(part => specialCharactersRegex.test(part));

    return !hasSpecialCharacters;
  }
}
