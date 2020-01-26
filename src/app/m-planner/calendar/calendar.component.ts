import { SocketService } from './../../services/socket.service';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {isSameDay, isSameMonth, addHours, subMinutes } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

import { Event } from './../../models/event';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnInit {

  @ViewChild('modalCreate', { static: true }) modalCreate: TemplateRef<any>;
  @ViewChild('modalEdit', { static: true }) modalEdit: TemplateRef<any>;
  @ViewChild('modalDetail', { static: true }) modalDetail: TemplateRef<any>;
  @ViewChild('modalMessage', { static: true }) modalMessage: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  public authToken: any;
  public userInfo: any;
  public disconnectedSocket: boolean;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  clickedDate: Date;

  receiverId: string;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  colors: any = [];
  defaultColor = 'blue';

  event: Event = new Event();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Delete', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal, public appService: AppService,
              private socketService: SocketService,
              private toastr: ToastrService,
              private route: ActivatedRoute) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  createEvent( date: Date ): void {
    if (this.userInfo.role === 2) {
      this.event.start = date;
      this.event.end = addHours(date, 1);
      this.event.color = this.colors[this.defaultColor];
      this.event.colorName = this.defaultColor;
      this.modal.open(this.modalCreate, { size: 'lg' });
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (action === 'Edit') {
      this.event = event;
      let colorList = Object.keys(this.colors).map(e => {
          return e;
      });
      colorList.forEach( color => {
        if (this.colors[color].primary === event.color.primary) {
          this.event.colorName = color;
        }
      });
      this.event.userId = this.receiverId;
      this.modal.open(this.modalEdit, { size: 'lg' });
    } else if (action === 'Create') {
      this.event = new Event();
      if (this.event.color !== null || this.event.color !== undefined) {
        this.event.color = this.colors[this.defaultColor];
      }
      this.event.colorName = this.defaultColor;
      this.modal.open(this.modalCreate, { size: 'lg' });
    } else if (action === 'Delete') {
      this.modal.open(this.modalMessage, { size: 'lg' });
    } else {
      this.event = event;
      let colorList = Object.keys(this.colors).map(e => {
          return e;
      });
      colorList.forEach( color => {
        if (this.colors[color].primary === event.color.primary) {
          this.event.colorName = color;
        }
      });
      this.modal.open(this.modalDetail, { size: 'sm' });
    }
  }

  addEvent(): void {
    if (!this.event.title) {
      this.toastr.error('Title of the event is missing');
    } else {
      this.event.userId = this.receiverId;
      this.event.createdBy = this.userInfo.firstName + ' ' + this.userInfo.lastName;
      this.event.status = 'created';
      this.appService.createCalendarEvent(this.event).subscribe((data) => {
        if (data.status === 200) {
          this.toastr.success(data.message);
          this.events = [
            ...this.events,
            {
              title: this.event.title,
              start: this.event.start,
              end: this.event.end,
              color: this.colors[this.event.colorName],
              allDay: this.event.allDay,
              actions: (this.userInfo.role === 2) ? this.actions : []
            }
          ];
          this.refresh.next();
          this.modal.dismissAll();
          this.sendNotification();
        } else {
          this.toastr.error(data.message);
          this.refresh.next();
          this.modal.dismissAll();
        }
      });
    }
  }

  updateEvent(): void {
    this.event.status = 'updated';
    this.appService.updateCalendarEvent(this.event).subscribe((data) => {
      if (data.status === 200) {
        this.toastr.success(data.message);
        this.refresh.next();
        this.modal.dismissAll();
        this.sendNotification();
      } else {
        this.toastr.error(data.message);
        this.refresh.next();
        this.modal.dismissAll();
      }
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.event.status = 'deleted';
    this.event.title = eventToDelete.title;
    this.appService.deleteCalendarEvent(eventToDelete).subscribe((data) => {
      if (data.status === 200) {
        this.toastr.success(data.message);
        this.modal.dismissAll();
        this.events = this.events.filter(event => event !== eventToDelete);
        this.refresh.next();
        this.sendNotification();
      } else {
        this.toastr.error(data.message);
        this.modal.dismissAll();
        this.refresh.next();
      }
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getEvents(resolvedEvents) {
    this.events = [];
    if (resolvedEvents) {
      resolvedEvents.forEach(event => {
          let newEvent = {
            id: event.calendarEventId,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            color: this.colors[event.color],
            allDay: event.allDay,
            actions: (this.userInfo.role === 2) ? this.actions : [],
            createdBy: event.createdBy
          };
          this.events.push(newEvent);
      });
    }
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.verifyUserConfirmation();
    this.getNotification();
    this.getColors();
    if (this.route.data) {
      this.route.data.subscribe((resolvedResults) => {
        this.getEvents(resolvedResults.events.data);
        this.receiverId = this.route.snapshot.params.id;
        this.refresh.next();
      });
    }
  }

  public getColors(): void {
    this.colors = this.route.snapshot.data.colors;
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(() => {
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
    });
  }

  public sendNotification(): void {
    let message = {
      senderId: this.userInfo.userId,
      senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
      receiverId: this.receiverId,
      message: this.event.title,
      notifyAt: subMinutes(this.event.start, 1),
      status: this.event.status,
      isDismissed: false
    };
    this.socketService.sendNotification(message);
  }

  public getNotification: any = () => {
    this.socketService.onReceivingNotification(this.userInfo.userId).subscribe((data) => {
      if (this.receiverId === data.receiverId) {
        if (data.status === 'created') {
          this.toastr.success(`Notification received: A new Event "${data.message}" has been created`);
        } else if (data.status === 'updated') {
          this.toastr.success(`Notification received: Event "${data.message}" has been modified`);
        } else if (data.status === 'deleted') {
          this.toastr.success(`Notification received: Event "${data.message}" has been deleted`);
        } else {
            this.toastr.success(`Notification received: "${data.message}"`);
        }
      }
      this.refresh.next();
    });
  }
}
