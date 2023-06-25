import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/service/post-service';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  postList=new Array(0);
  pageNo=0;
  pageIndexCount:any;
  postListForm: FormGroup<any>;
  constructor(private service:PostService,private route: ActivatedRoute){
    postListForm: FormGroup<any>;
    this.postListForm = new FormGroup({
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
       //  filter((value:any) => value.length >=3), // filtering 3 length-values
         distinctUntilChanged(), // filtering duplicate values 
         switchMap( str => 
              {
                console.log(str);
                this.pageNo=0;
                return this.service.find(str,this.pageNo);
              }
            )
         
        ).subscribe( (response:any) => {
          console.log(`response ${response}`);
          this.postList=response;
          this.pageNo++;
        }
          )
  }
  loadBlogs():void {
    const posts$=this.service.find(this.srchBoxInput,this.pageNo);    
    posts$.pipe(
      //takeWhile((response:any) => response.length >0  )
      )
        .subscribe((response:any) => {
          let temp=this.postList;
          Array.prototype.push.apply(this.postList,response); 
          this.pageNo++;
        }
      );
  }
  onDelete(id: string): void {
    const deleteOneSource$=this.service.deleteOne(id);
    deleteOneSource$.pipe(

    ).subscribe((response: any) => {
      console.log(response);
      this.loadBlogs();
    })

  }
  showCommentsDiv():void {
    const div= document.getElementById('postCommentsDiv') as HTMLElement;;
    div.classList.remove("invisible");
  }
  hideCommentsDiv():void {
    const div= document.getElementById('postCommentsDiv') as HTMLElement;;
    div.classList.add("invisible");
  }
  onEdit(blogId: number): void {
    alert("on Edit blogId = " + blogId)
  }
  get srchBoxInput(){
    return this.postListForm.get('srchBoxInput')?.value;
  }
}
