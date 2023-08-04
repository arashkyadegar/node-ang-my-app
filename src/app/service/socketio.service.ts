import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, fromEvent, map, merge, mergeAll, mergeMap, of, switchMap } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
   connect$: any;
  private socket = io('http://localhost:5000', {
    path: '',
    reconnection: true,
    autoConnect: false,
    extraHeaders: {
      Authorization: 'Bearer' 
    }
  });
  
  // Initialise Socket.IO and wrap in observable
  setup(): Observable<Object> {
    const socket$ = of(io('http://localhost:5000'))
    this.connect$ = socket$.pipe(
      map( socket => {
        fromEvent(socket, 'connect')
      })
    )
    return this.connect$;
    }

    sendMessage(message: string){
      const x$ = fromEvent(this.connect$,'message')
    }
  }


