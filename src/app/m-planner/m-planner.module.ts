import { AuthGuard } from './../auth/auth-guard';
import { NavbarComponent } from './../navbar/navbar.component';
import { ColorResolver } from './../resolver/color-resolver';
import { EventResolver } from './../resolver/event-resolver';
import 'flatpickr/dist/flatpickr.css'; 
import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from './calendar/calendar.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forRoot([{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
                          { path: 'dashboard/:id', component: DashboardComponent,
                            resolve : { events : EventResolver , colors : ColorResolver},
                            runGuardsAndResolvers: 'paramsOrQueryParamsChange' },
                          {path : '**', component: NotFoundComponent}])
  ],
  declarations: [CalendarComponent, DashboardComponent, NavbarComponent],
  exports: [CalendarComponent],
  providers: [EventResolver, ColorResolver, AuthGuard]
})
export class MPlannerModule {}
