import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [{path : 'signup', component: SignupComponent}];

@NgModule({
  declarations: [SignupComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent],
  imports: [
    ToastrModule.forRoot(),
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    BrowserAnimationsModule

  ]
})
export class UserModule { }
