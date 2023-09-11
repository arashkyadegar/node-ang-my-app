import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject, fromEvent, map, merge, mergeAll, mergeMap, of, switchMap, take } from 'rxjs';
import { io, Socket } from 'socket.io-client';



@Injectable({
  providedIn: 'root'
})


export class SocketioService {

  //socket$: any;
  socket$: Observable<object>;
  constructor(){
    this.socket$ = of(io('http://localhost:8000/'))

  }

  getDisconnect(): Observable<any> {
    const disconnection$ = this.socket$.pipe(
      switchMap((socket: any) => 
        fromEvent(socket,'disconnect').pipe(
          map( () => socket)
        )
      )
    );
    return disconnection$;
  }

  getConnect(): Observable<any> {
   return this.socket$.pipe(
      switchMap((socket:any) => 
        fromEvent(socket,'connect').pipe(
          map( () => socket)
        )
      )
    )
  }

  getOnline() {
    const privateMessage$ = this.socket$.pipe(
      switchMap ((socket: any) => 
        fromEvent(socket,'OnlineClientListRequest').pipe(
          map( (data) => {
            return data;
          })
        )
      )
    );
    return privateMessage$;
  }


  sendOnline(): Observable<any>  {
    const clientList =  this.socket$.pipe(
      switchMap ((socket: any) => 
        of(socket.emit('OnlineClientListRequest', {}))
      )
    );
    return clientList;
  }




  getPrivateMessage() {
    const privateMessage$ = this.socket$.pipe(
      switchMap ((socket: any) => 
        fromEvent(socket,'privateMessage').pipe(
          map( (data) => {
            console.log(data);
            return data;
          })
        )
      )
    );
    return privateMessage$;
  }


  sendPrivateMessage(data:any): Observable<any>  {
    const clientList =  this.socket$.pipe(
      switchMap ((socket: any) => 
        of(socket.emit('privateMessage', data))
      )
    );
    return clientList;
  }

  uploadSingleFile(files: any): Observable<any> {
    const uploadSource$ =  this.socket$.pipe(
      switchMap ((socket: any) => 
        of(socket.emit("upload", files[0], (status: any) => {
          console.log(status);
        }))
      )
    );
    return uploadSource$;
  }
}


