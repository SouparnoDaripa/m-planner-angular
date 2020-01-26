import { AppService } from './../services/app.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class ColorResolver implements Resolve<any> {
    constructor(private appService: AppService) {}

    resolve() {
        return this.appService.getColors();
    }
}
