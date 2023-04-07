import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { BlogService } from '../service/blog-service.service';
import { BlogEntity } from '../model/blog/blog-entity';

import {from,of,Observable,range, Subscription, fromEvent, interval } from 'rxjs';
import {map,take,filter, tap,reduce, scan, mapTo} from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
//import { Api404Error } from '../model/error/base-error';
@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ["../../../dist/output.css"]
})
export class BlogCreateComponent {
  myBlogForm: FormGroup<any>;


  constructor(private service :BlogService) {
    this.myBlogForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required])
  });
}
calcScrollPercent(element:any):number{
  //const doc = document.documentElement;
  const winScroll = element.scrollTop;
  const height = element.scrollHeight - element.clientHeight;
  return (winScroll / height) * 100;
}

ngOnInit() {  


}
reverse():void {
  const source$ = from (['1','2','3','4','5']);
  const upSideDown$=source$.pipe(
        reduce((acc,value) => {return (value + '-' +acc)})
  );
  upSideDown$.subscribe(console.log);
}
timer():void {
  const observer = {
    next: (val :any) => {console.log('timer is finished',val); },
    error:(err :any) => { console.error('error',err); },
    complete :() =>{ console.log('complete'); }
  }

  const sourse$=interval(1000);
  const countDown$=sourse$.pipe(
    map( () => -1),
    scan((acc,value)=> {return (acc+value)},5),
    filter (value => value >= 0)
  )


  countDown$.subscribe((value) => {
    if(!value)
        console.log('timer is done');
       else
        console.log(value);
  });
}
progressBar():void{
  let progressBarDiv=document.getElementById('progress-bar');

  //observer
    const observer = {
      next: (val :any) => { 
        if(progressBarDiv != undefined)  progressBarDiv.style.width= (val + '%');
       },
      error:(err :any) => { console.error('error',err); },
      complete :() =>{ console.log('complete'); }
    }
    //observable from event
    const scroll$=fromEvent(document,'scroll');
    const progressBar$ =scroll$.pipe(
      map((event:any) => this.calcScrollPercent(event.target.documentElement))
    )
   // progressBar$.subscribe(observer);
}
get f(){
  return this.myBlogForm.controls;
} 
get text(){
  return this.myBlogForm.get('text');
}

get date(){
  return this.myBlogForm.get('date');
}

get title(){
  return this.myBlogForm.get('title');
}
getplushundered(value:number):number {
return value+1000;
}
onReset():void{
  this.myBlogForm.reset();
} 
submit():void{
  if(this.myBlogForm.valid){
    const blog=<BlogEntity>this.myBlogForm.value;
    console.log(blog);
  }else
   console.log(this.myBlogForm.valid);
}
}
