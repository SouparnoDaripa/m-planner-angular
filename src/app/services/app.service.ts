import { HttpParams, HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AppService {

  private url = 'http://localhost:3002';

  constructor(public http: HttpClient) { }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoFromLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public signup = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('firstName', data.firstName)
                    .set('lastName', data.lastName)
                    .set('username', data.username)
                    .set('email', data.email)
                    .set('password', data.password)
                    .set('mobile', data.mobile);
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public login = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('email', data.email)
                    .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  }

  public logout = (): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/users/logout`);
  }

  public forgotPassword = (data): Observable<any> => {
    const params = new HttpParams()
                      .set('email', data.email);
    return this.http.post(`${this.url}/api/v1/users/forgotPassword`, params);
  }

  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
                        .set('email', data.email)
                        .set('newPassword', data.password);
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public getCountryCode = (): Observable<any> => {
    return this.http.get('./../../assets/data/countrycodelist.json');
  }

  public getColors = (): Observable<any> => {
    return this.http.get('./../../assets/data/colors.json');
  }

  public getCalendarEvents = (): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/events/getAll`);
  }

  public getUserCalendarEvents = (userId): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/events/${userId}/getAll`);
  }

  public createCalendarEvent = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('start', moment(data.start).format('YYYY-MM-DD HH:mm'))
                    .set('end', moment(data.end).format('YYYY-MM-DD HH:mm'))
                    .set('title', data.title)
                    .set('userId', data.userId)
                    .set('color', data.colorName)
                    .set('createdBy', data.createdBy)
                    .set('allDay', data.allDay);
    return this.http.post(`${this.url}/api/v1/events/create`, params);
  }
  public updateCalendarEvent = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('id', data.id)
                    .set('start', moment(data.start).format('YYYY-MM-DD HH:mm'))
                    .set('end', moment(data.end).format('YYYY-MM-DD HH:mm'))
                    .set('title', data.title)
                    .set('color', data.colorName)
                    .set('allDay', data.allDay);
    return this.http.post(`${this.url}/api/v1/events/update`, params);
  }
  public deleteCalendarEvent = (data): Observable<any> => {
    const params = new HttpParams()
                    .set('id', data.id);
    return this.http.post(`${this.url}/api/v1/events/delete`, params);
  }

  public getAllNormalUsers = (): Observable<any> => {
    return this.http.get(`${this.url}/api/v1/users/getAllNormalUsers`);
  }
}
