import { Component } from '@angular/core';
import { BlogService } from 'src/app/service/blog-service.service';
import { BlogEntity } from 'src/app/model/blog/blog-entity';
import { takeWhile, Observable, EmptyError, map, fromEvent, take, first, debounceTime, distinctUntilChanged, switchMap, catchError, mergeMap, takeUntil, filter } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ajax } from 'rxjs/ajax';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ["../../../../dist/output.css"]
})
export class BlogListComponent {
  myblogListForm: FormGroup<any>;
  blogList=new Array(0);
  pageNo=0;
  pageIndexCount:any;
  filter$: any;

  constructor(private blogService:BlogService,private route: ActivatedRoute){
    myblogListForm: FormGroup<any>;
    this.myblogListForm = new FormGroup({
      srchBoxInput: new FormControl('', [Validators.required]),
      srchBoxBtn:new FormControl('', [Validators.required]),
      shwMoreBtn:new FormControl('', [Validators.required])
  });

  }

  ngOnInit() {
    this.loadBlogs();

    //observable from scroll event
    const shwMoreBtn=document.getElementById("shwMoreBtn") as HTMLElement;
    const shwMoreBtn$=fromEvent(shwMoreBtn,'click');
    shwMoreBtn$.pipe(
      map( () => {
        this.loadBlogs()
      }),
    ).subscribe();

    const scroll$=fromEvent(document,'scroll');

    scroll$.pipe(
      debounceTime(1000),
      map((event:any) => {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        // When the user is [modifier]px from the bottom, fire the event.
        let modifier = 200; 
        if(currentScroll + modifier > documentHeight) {
          this.loadBlogs();
        }
      }
      )
    ).subscribe()

    // this.filter$ = this.route.queryParamMap.pipe(
    //   map((params: ParamMap) => params.get('page')),
    // ).subscribe(v => {
    //   if (v != undefined){

    //       this.pageNo=parseInt(v);

    //   }
    // });


        ///elems
        const searchBtn=document.getElementById('srchBoxBtn') as HTMLElement;

        //observable from event
        const searchBtn$=fromEvent(searchBtn,'click');
        searchBtn$.pipe(
          map(() => 
             this.srchBoxInput
          ),
         filter((value:any) => value.length >=3), // filtering 3 length-values
         distinctUntilChanged(), // filtering duplicate values 
         switchMap( srch => 
              {
                this.pageNo=0;
                return this.blogService.search(srch,this.pageNo);
              }
            )
         
        ).subscribe( (response:any) => {
          console.log(`response ${response}`);
          this.blogList=response;
           this.pageNo++;
        }
          )
  }
  counter(i: number) {
       return new Array(i);
  }
  loadBlogs():void {
    const blogs$=this.blogService.find(this.srchBoxInput,this.pageNo);    
    blogs$.pipe(
      //takeWhile((response:any) => response.length >0  )
      )
        .subscribe((response:any) => {
          console.log(response);
          let temp=this.blogList;
          Array.prototype.push.apply(this.blogList,response); 
          this.pageNo++;
        }
      );
  }
  onDelete(id:string):void{
    console.log("on Delete blogId = " + id)
  }
  
  onEdit(blogId:number):void{
    //console.log("on Edit blogId = " + blogId)
  }
  get srchBoxInput(){
    return this.myblogListForm.get('srchBoxInput')?.value;
  }
}
