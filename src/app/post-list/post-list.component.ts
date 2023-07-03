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
  postList = new Array(0);
  commentList = new Array(0);
  pageNo=0;
  pageIndexCount:any;
  postListForm: FormGroup<any>;
  constructor(private service:PostService,private route: ActivatedRoute){
    postListForm: FormGroup<any>;
    this.postListForm = new FormGroup({
      srchBoxInput: new FormControl('', [Validators.required]),
      srchBoxBtn:new FormControl('', [Validators.required]),
      shwMoreBtn:new FormControl('', [Validators.required]),
      srchBoxrateInput: new FormControl('', [Validators.required]),
      srchBoxIsVisibleChBox: new FormControl('', [Validators.required])
  });

  }

  ngOnInit() {
    this.handleCommentTab();
    this.loadBlogs();
    this.handleAdvanceSearch();
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
        const isVisibleChbox = document.getElementById('srchbox-is-visible-chbox') as HTMLInputElement;
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
                return this.service.search(str,this.pageNo,isVisibleChbox.checked);
              }
            )
         
        ).subscribe( (response:any) => {
          console.log(`response ${response}`);
          this.postList=response;
          this.pageNo++;
        }
          )
  }
  handleCommentTab() {
    //elems
    const commentsDetailOverviewDiv = document.getElementById('comments-detail-overview-div') as HTMLElement;
    const commentsListOverviewDiv =  document.getElementById('comments-list-overview-div') as HTMLElement;
    const commentsListTab = document.getElementById('comments-list-tab') as HTMLElement;
    const commentsDetailstTab = document.getElementById('comments-details-tab') as HTMLElement;

    //sources
  const  commentsListTab$ = fromEvent(commentsListTab,'click');
  const commentsDetailstTab$ = fromEvent(commentsDetailstTab,'click');

commentsListTab$.pipe(
  map( () => 
  {
    commentsListOverviewDiv.classList.remove('hidden');
    commentsDetailOverviewDiv.classList.add('hidden');
    commentsListTab.classList.remove("border-white");
    commentsListTab.classList.remove("border");
    commentsDetailstTab.classList.add("border");
    commentsDetailstTab.classList.add("border-black");
return
  }
  )
)
.subscribe();



commentsDetailstTab$.pipe(
  map( () => 
  {
    commentsDetailOverviewDiv.classList.remove('hidden');
    commentsListOverviewDiv.classList.add('hidden');
    commentsDetailstTab.classList.remove("border-white");
    commentsDetailstTab.classList.remove("border");
    commentsListTab.classList.add("border");
    return commentsListTab.classList.add("border-black");
  }
  )
)
.subscribe();
  }
  loadBlogs():void {
    const title = this.srchBoxInput;
    let posts$;
    
    if(title != ''){
       posts$ = this.service.search(title,this.pageNo,false);
    }else{
       posts$ = this.service.find(this.pageNo);   
    }
 
    posts$.pipe(
      //takeWhile((response:any) => response.length >0  )
      )
        .subscribe((response: any) => {
          let temp = this.postList;
          Array.prototype.push.apply(this.postList,response); 
          this.pageNo ++;
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
  showCommentsDiv(postId:any): void {
    const findOneSource$=this.service.findOne(postId);
    findOneSource$.pipe(
      map((reponse:any) => 
        reponse.comments
      )
    ).subscribe((comments: any) => {
      this.commentList = comments;
    })


    const div= document.getElementById('postCommentsDiv') as HTMLElement;
    div.classList.remove("invisible");
  }
  hideCommentsDiv(): void {


    const div= document.getElementById('postCommentsDiv') as HTMLElement;
    div.classList.add("invisible");
  }
  onEdit(blogId: number): void {
    alert("on Edit blogId = " + blogId)
  }
  handleAdvanceSearch():void {
    const advSrchBoxBtn=document.getElementById("adv-srchBox-Btn") as HTMLElement;
    const click$=fromEvent(advSrchBoxBtn,'click');

    click$.subscribe(() => console.log('click'));
  }
  get srchBoxInput(){
    return this.postListForm.get('srchBoxInput')?.value;
  }

}
