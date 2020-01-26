import { AppService } from './../../services/app.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: string;
  public lastName: string;
  public countryCode: string;
  public mobile: string;
  public username: string;
  public email: string;
  public password: string;
  public countryCodeList: string[];
  constructor(
    private appService: AppService,
    private router: Router,
    private toastr: ToastrService,
    private vcr: ViewContainerRef) { }

  ngOnInit() {
    this.getCountryCodes();
  }

  public goToSignIn() {
    this.router.navigate(['/']);
  }

  public signUpConfirmation() {
    if (!this.firstName) {
      this.toastr.warning('First Name is missing');
    } else if (!this.lastName) {
      this.toastr.warning('Last Name is missing');
    } else if (!this.username) {
      this.toastr.warning('Username is missing');
    } else if (!this.countryCode) {
      this.toastr.warning('Country Code is missing');
    } else if (!this.email) {
      this.toastr.warning('Email is missing');
    } else if (!this.mobile) {
      this.toastr.warning('Phone No. is missing');
    } else if (!this.password) {
      this.toastr.warning('Password is missing');
    } else {
      const data = {
        firstName : this.firstName,
        lastName : this.lastName,
        username : this.username,
        email : this.email,
        mobile : this.countryCode + this.mobile,
        password: this.password
      };
      console.log(data);

      this.appService.signup(data).subscribe((apiResponse) => {
        // console.log(apiResponse);
        if ( apiResponse.status === 200 ) {
          this.toastr.success('You have successfullly Signed Up');
          setTimeout(() => this.goToSignIn(), 1000);
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error('Some Error occurred');
      });
    }
  }

  public getCountryCodes() {
    this.appService.getCountryCode().subscribe(data => {
      this.countryCodeList = data;
    });
  }

  public onChange(event){
    console.log(event.value);
  }
}
