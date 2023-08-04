import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, fromEvent, map, merge, of, pipe, switchMap, tap } from 'rxjs';
import { SocketioService } from '../service/socketio.service';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-socket-io',
  templateUrl: './socket-io.component.html',
  styleUrls: ['./socket-io.component.css']
})

@Injectable()   
export class SocketIoComponent {
  socketId: string = '';
  socketObject: any;
  socketStatus = false;
  postCreateFrm: FormGroup<any>;
  newMessagesSubject: any;
  constructor(private service:SocketioService) {
    this.postCreateFrm = new FormGroup({
      bodyTxt: new FormControl('',[Validators.required])
  });
  }


  ngOnInit() {

    
    const privateMessageSubmitBtn = document.getElementById('private-message-submit-btn') as HTMLElement;
    const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
    const onlineClientsBox =  document.getElementById('online-clients-box') as HTMLElement;
    const chatBox = document.getElementById('chat-box') as HTMLElement;
    const privateSubmit$ = fromEvent(privateMessageSubmitBtn,'click');


    const socket$ = of(io('http://localhost:5000'))


    const connection$ = socket$.pipe(
      switchMap(socket => 
         fromEvent(socket,'connect').pipe(
          map( () => {
          this.socketId = socket.id;
          this.socketObject = socket;
          return socket;
        })
        )
      )
    ).subscribe(data => {
      this.socketStatus = true;
    });


    const disConnection$ = socket$.pipe(
      switchMap(socket => 
         fromEvent(socket,'disconnect').pipe(
          map( () => socket)
        )
      )
    ).subscribe(() => {
      this.socketStatus = false;
    });


    const getMessage$ = socket$.pipe(
      switchMap (socket => 
          fromEvent(socket,'message')
      )
    );


    const getClients$ = socket$.pipe(
      switchMap (socket => 
          fromEvent(socket,'getOnlineClients')
      )
    );

    getClients$.subscribe((clients) => {
      clients.forEach( (element: any) => {
        console.log(element);
        onlineClientsBox.innerHTML = onlineClientsBox.innerHTML + 
        '<div><div class=" border-2 border-pink-500 float-left m-2 ' +
        'bg-pink-300 rounded-md min-w-min w-1/6 '+
        'p-1">'+ element +'</div></div>'
      });
    });


    getMessage$.pipe(
      map(socket => {
        console.log(socket);
        return socket
      })
    ).subscribe( (socket) => {
      chatBox.innerHTML = chatBox.innerHTML + 
      '<div><div class="block border-2 border-green-500 float-right ' +
      'bg-green-300 rounded-md min-w-min w-3/6 '+
      'p-5">'+ socket.senderId + ' : ' +  socket.message +'</div></div>';

    });

    const getPrivateMessage$ = socket$.pipe(
      switchMap (socket => 
          fromEvent(socket,'privateMessage')
      )
    );


    const sendPrivateMessage$ = socket$.pipe(
      switchMap (socket => 
          fromEvent(socket,'privateMessage')
      )
    );

    sendPrivateMessage$.pipe(
      map(socket => {
        //console.log(socket);
        return socket;
      })
    ).subscribe( (socket) => {
      //console.log(`sendPrivateMessage ${socket}`);
  })

    getPrivateMessage$.pipe(
      map(socket => {
       // console.log(socket);
        return socket
      })
    ).subscribe( (socket) => {
      console.log(socket);
      chatBox.innerHTML = chatBox.innerHTML + 
      '<div><div class="block border-2 border-green-500 float-right ' +
      'bg-green-300 rounded-md min-w-min w-3/6 '+
      'p-5">'+ socket.senderId + ' : ' +  socket.message+'</div></div>';
    })
    


      privateSubmit$.subscribe((str) => {
        const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
        this.sendPrivateMessage(bodyTxt.value);
      });




    //   this.socket.on('connect', () => {
    //     this.socketId = this.socket.ioSocket.id;
    //   })

    // this.socket.on('message', (data: any) =>{
    //   console.log(this.socket.ioSocket.id);


    // })
    // console.log(this.socket);
  }


  // getMessage() {
  //   return this.socket.fromEvent('message').pipe(map((data : any) => data.msg));
  // }   
  sendMessage(str: string) {
    this.socketObject.emit('message',str);
  }

  sendPrivateMessage(str: string) {
    const recieverIdTxt = document.getElementById('reciever-id') as HTMLInputElement;
    this.socketObject.emit('privateMessage',{reciever : recieverIdTxt.value , message : str });
  }
  get body() {
    return this.postCreateFrm.get('bodyTxt');
  }
}
