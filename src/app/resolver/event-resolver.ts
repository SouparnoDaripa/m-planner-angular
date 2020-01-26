import { Event } from './../models/event';
import { AppService } from './../services/app.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class EventResolver implements Resolve<Event> {

    constructor(private appService: AppService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // console.log("Resolver called!");
        return this.appService.getUserCalendarEvents(route.paramMap.get('id'));
    }
}
