import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService {
  private url = 'http://localhost:3002/';
  private socket;
  constructor() {
    // connection is being created
    // handshake
    this.socket = io(this.url);
  }

  // verify the user
  public verifyUser: any = () => {
    return new Observable((observer) => {
      this.socket.on('verifyUser', (data: any) => {
        observer.next(data);
      });
    });
  }

 // check the disconnection of socket
  public disconnectedSocket = () => {
    return new Observable((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });
    });
  }

  // Set-user to verify auth

  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  }

  // Normal users receive the notification when online

  public onReceivingNotification = (userId: any) => {
    return new Observable<any>((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  // Admin send the notification on new event or updated event

  public sendNotification = (message) => {
    this.socket.emit('notify', message);
  }

  public exitSocket: any = () => {
    this.socket.disconnect();
  }

}
