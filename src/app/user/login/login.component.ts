import { AppService } from './../../services/app.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(public appService: AppService,
              private router: Router,
              private toastr: ToastrService,
              private vcr: ViewContainerRef) { }

  ngOnInit() {
  }

  public goToSignUp() {
    this.router.navigate(['/signup']);
  }

  public goToDashboard(id?: string) {
    if (id) {
      this.router.navigate([`/dashboard/${id}`]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  public forgotPassword() {
    this.router.navigate(['/forgotPassword']);
  }

  public signInConfirmation() {
    if (!this.email) {
      this.toastr.warning('Email is missing');
    } else if (!this.password) {
      this.toastr.warning('Password is missing');
    } else {
      const data = {
        email : this.email,
        password: this.password
      };
      // console.log(data);

      this.appService.login(data).subscribe((apiResponse) => {
        if ( apiResponse.status === 200 ) {
          Cookie.set('authToken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          Cookie.set('role', apiResponse.data.userDetails.role);
          this.appService.setUserInfoFromLocalStorage(apiResponse.data.userDetails);
          this.toastr.success('You have successfullly Signed In');
          if (Cookie.get('role') === '2') {
            setTimeout(() => this.goToDashboard(), 2000);
          } else {
            setTimeout(() => this.goToDashboard(Cookie.get('receiverId')), 2000);
          }
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error(err.error.message);
      });
    }
  }
}
