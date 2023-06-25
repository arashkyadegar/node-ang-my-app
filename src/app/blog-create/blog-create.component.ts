import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { BlogService } from '../service/blog-service.service';
import { BlogEntity } from '../model/blog/blog-entity';
import {ajax } from 'rxjs/ajax';
import {from,of,Observable,range, Subscription, fromEvent, interval,merge, empty, forkJoin,Subject } from 'rxjs';
import {concatMap, debounceTime, delay, distinctUntilChanged, map, scan, switchMap, take, takeUntil ,takeWhile, tap} from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { UserEntity } from '../model/user/user-entity';
import { PostEntity } from '../model/post/post-entity';


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
      body: new FormControl('', [Validators.required]),
      //date: new FormControl('', [Validators.required]),
      author:new FormControl('',[Validators.required])

  });
}
calcScrollPercent(element:any):number{
  //const doc = document.documentElement;
  const winScroll = element.scrollTop;
  const height = element.scrollHeight - element.clientHeight;
  return (winScroll / height) * 100;
}

ngOnInit() {  
  this.progressBar();

  // const interval$=interval(1000);
  // const inputBox=document.getElementById('title') as HTMLInputElement;
  // const input$=fromEvent(inputBox,'keyup');
  // const click$=fromEvent(document,'click');
  // click$.pipe(
  //   concatMap( v=> interval$.pipe(
  //     take(3)
  //   ))
  // ).subscribe(observer);
  // input$.pipe(
  //   map((event:any) =>
  //   event.target.value
  //   ),
  //     debounceTime(1000),
  //     distinctUntilChanged(),
  //         switchMap((value:any) => {
  //           let rslt = ajax.getJSON('https://api.github.com/users/'+ value);
  //           return rslt
  //         }),
  //       ).subscribe(console.log);

const observer ={
  next: (val:any) => console.log('next',val),
  error:(err :any) => console.log('error',err),
  complete : () => console.log('complete')
}

const subject =new Subject();
const subscription =subject.subscribe(observer);
subject.next('hello');
const subscription2 =subject.subscribe(observer);
subject.next('world');

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
get body(){
  return this.myBlogForm.get('body');
}

get title(){
  return this.myBlogForm.get('title');
}
get author(){
  return this.myBlogForm.get('author');
}
getplushundered(value:number):number {
return value+1000;
}
onReset():void{
  this.myBlogForm.reset();
} 
submit():void{
  if(this.myBlogForm.valid){
    // let posts=new Array<PostEntity>;
    // let user=new UserEntity();
    const blog=<BlogEntity>this.myBlogForm.value;
    let author=new UserEntity();
    author.setName=this.author?.value;
    blog.author=author;
    const source$=this.service.add(blog);
    source$.subscribe(value => {
    console.log(value)
    });
  }else
   console.log(this.myBlogForm.valid);
}
}
