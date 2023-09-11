import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, debounceTime, fromEvent, map, merge, of, pipe, switchMap, tap } from 'rxjs';
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
    const chatBox = document.getElementById('chat-box') as HTMLElement;
    const privateSubmit$ = fromEvent(privateMessageSubmitBtn,'click');

    const getOnlineClientsBtn = document.getElementById('get-online-clients-btn') as HTMLElement;
    const getOnlineClientsClick$ = fromEvent(getOnlineClientsBtn,'click');

    this.service.getOnline().pipe(
      debounceTime(1000)
    ).subscribe((data:any) => {
      this.fillSocketList(data.socketsArray);
    });
      

    this.service.getConnect()
      .subscribe((data:any) => {
            this.socketId = data.id;
            this.socketStatus = true;
          });

    this.service.getDisconnect()
      .subscribe((socket:any) => {
        this.socketStatus = false;
      });

    this.service.getPrivateMessage()
      .subscribe((socket:any) => {
        console.log(socket.message);
        chatBox.innerHTML = chatBox.innerHTML + 
        '<div><div class="block border-2 border-green-500 float-right ' +
        'bg-green-300 rounded-md min-w-min w-3/6 '+
        'p-1">'+ socket.senderId + ' : ' +  socket.message +'</div></div>';
      }
    );


      privateSubmit$.subscribe((str) => {
        const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
        this.sendPrivateMessage1(bodyTxt.value);
      });

  }

  fillSocketList(clientList: string[]) {
    const onlineClientsBox =  document.getElementById('online-clients-box') as HTMLElement;
    clientList.forEach( (element: any) => {
      if(element != this.socketId) {
        const el = document.createElement('div');
          el.addEventListener('click', (event) => {
            this.fillRecieverId(element);
          });
          el.textContent = element;
          el.className ='border-2 border-pink-500 float-left m-2 ' +
            'bg-pink-300 rounded-md min-w-min w-1/6 p-1' ;
          onlineClientsBox.appendChild(el);
      }
    });
  
  }

  caller(){
     this.service.sendOnline().subscribe();

  }

  fillRecieverId(str:string){
    const reciver =  document.getElementById('reciever-id') as HTMLInputElement;
    reciver.value = str;
  }

  sendMessage(str: string) {
    this.socketObject.emit('message',str);
  }

  sendPrivateMessage1(str: string) {
    const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
    const reciver =  document.getElementById('reciever-id') as HTMLInputElement;
    const chatBox = document.getElementById('chat-box') as HTMLElement;
    const data = {
      reciever : reciver.value,
      message : bodyTxt.value
    }

    this.service.sendPrivateMessage(data)
      .subscribe( (d:any) => {
        chatBox.innerHTML = chatBox.innerHTML + 
        '<div><div class="block border-2 border-blue-500 ' +
        'bg-blue-300 rounded-md min-w-min w-3/6 '+
        'p-1">you : ' +  data.message +'</div></div>';
      }
      );
  }

upload() {
  const fileInput = document.getElementById('file-input') as HTMLInputElement;

  this.service.uploadSingleFile(fileInput.files).subscribe(console.log);
}

  get body() {
    return this.postCreateFrm.get('bodyTxt');
  }
}
