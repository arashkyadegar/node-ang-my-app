import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-socket-io',
  templateUrl: './socket-io.component.html',
  styleUrls: ['./socket-io.component.css']
})
@Injectable()   
export class SocketIoComponent {
   socket: Socket;
   postCreateFrm: FormGroup<any>;
  constructor(socket: Socket) {
    this.socket = socket;
    this.postCreateFrm = new FormGroup({
      bodyTxt: new FormControl('',[Validators.required])

  });
  }
  ngOnInit() {
    const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
    const createPostSubmitBtn = document.getElementById('create-post-submit-btn') as HTMLElement;
    const createSubmit$ = fromEvent(createPostSubmitBtn,'click');
    createSubmit$.pipe(
      map( () => {
        let value =  bodyTxt.value .trim();
        bodyTxt.value = "";
        return  value;
      })
    ).subscribe((str) => {
      this.sendMessage(str);
    });
    this.socket.on('connect', function(){
      console.log('connected !');
    })
    console.log(this.socket);
  }


  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data : any) => data.msg));
  }
 
  get body() {
    return this.postCreateFrm.get('bodyTxt');
  }


}
