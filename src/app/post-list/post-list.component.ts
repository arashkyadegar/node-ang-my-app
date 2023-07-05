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
    this.handleCommentTabToggle();
    this.loadPosts();
    this.handleAdvanceSearchClick();
    this.handleLoadMoreBtnClick();
    this.handleLoadOnScroll();
    this.handleSearchBtnClick();
  }


  handleCommentTabToggle() {
    const cmntsDetailDiv = document.getElementById('cmnts-detail-div') as HTMLElement;
    const cmntsListDiv =  document.getElementById('cmnts-list-div') as HTMLElement;
    const cmntsListTab = document.getElementById('cmnts-list-tab') as HTMLElement;
    const cmntsDetailstTab = document.getElementById('cmnts-detail-tab') as HTMLElement;
    const cmntsListTab$ = fromEvent(cmntsListTab,'click');
    const cmntsDetailstTab$ = fromEvent(cmntsDetailstTab,'click');
    cmntsListTab$.pipe(
      map( () => 
      {
        cmntsListDiv.classList.remove('hidden');
        cmntsDetailDiv.classList.add('hidden');
        cmntsListTab.classList.remove("border-white");
        cmntsListTab.classList.remove("border");
        cmntsDetailstTab.classList.add("border");
        cmntsDetailstTab.classList.add("border-black");
    return
      }
      )
    ).subscribe();

    cmntsDetailstTab$.pipe(
      map( () => 
      {
        cmntsDetailDiv.classList.remove('hidden');
        cmntsListDiv.classList.add('hidden');
        cmntsDetailstTab.classList.remove("border-white");
        cmntsDetailstTab.classList.remove("border");
        cmntsListTab.classList.add("border");
        return cmntsListTab.classList.add("border-black");
      }
      )
    ).subscribe();
  }


  loadPosts():void {
    const title = this.srchBoxInput;
    let posts$;
    let pageNumber = this.getPageNumberofPostsList();

    if(title === ""){
      posts$ = this.service.find(pageNumber);   
    }else{
      posts$ = this.service.search(title,pageNumber);
    }

    posts$.pipe(
      )
        .subscribe((response: any) => {
          Array.prototype.push.apply(this.postList,response); 
        }
      );
  }


  handleAdvanceSearchClick():void {
    const advSrchBoxBtn=document.getElementById("adv-srchBox-Btn") as HTMLElement;
    const click$=fromEvent(advSrchBoxBtn,'click');
    click$.subscribe(() => console.log('click'));
  }


  handleLoadMoreBtnClick(): void {
    const shwMoreBtn=document.getElementById("shwMoreBtn") as HTMLElement;
    const shwMoreBtn$=fromEvent(shwMoreBtn,'click');
    shwMoreBtn$.pipe(
      map( () => {
        this.loadPosts();
      }),
    ).subscribe();
  }


  handleLoadOnScroll(): void {
    const scroll$=fromEvent(document,'scroll');
    scroll$.pipe(
      debounceTime(1000),
      map((event:any) => {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;
        let modifier = 200; 
        if(currentScroll + modifier > documentHeight) {
          this.loadPosts();
        }
      }
      )
    ).subscribe()
  }


  handleSearchBtnClick(): void {
    const searchBtn=document.getElementById('srchBoxBtn') as HTMLElement;
    const isVisibleChbox = document.getElementById('srchbox-is-visible-chbox') as HTMLInputElement;
    const searchBtn$=fromEvent(searchBtn,'click');
    searchBtn$.pipe(
      map(() => 
         this.srchBoxInput
      ),
      distinctUntilChanged(), 
      switchMap( str => 
            {
              console.log(str);
              let pageNumber =0;
              return this.service.search(str,pageNumber);
            }
          )
      ).subscribe( (response:any) => {
        this.postList=response;
      }
      )
  }


  onDelete(id: string): void {
    const deleteOneSource$=this.service.deleteOne(id);
    deleteOneSource$.pipe().subscribe((response: any) => {
      console.log(response);
      this.loadPosts();
    })
  }


  showCommentsDiv(postId:any): void {
    const div= document.getElementById('post-cmnts-Div') as HTMLElement;
    const findOneSource$=this.service.findOne(postId);
    findOneSource$.pipe(
      map((reponse:any) => 
        reponse.comments
      )
    ).subscribe((comments: any) => {
      this.commentList = comments;

    })
    div.classList.remove("invisible");
  }


  hideCommentsDiv(): void {
    const div= document.getElementById('post-cmnts-Div') as HTMLElement;
    div.classList.add("invisible");
  }


  onEdit(blogId: number): void {
    alert("on Edit blogId = " + blogId)
  }
    getPageNumberofPostsList(): number {
      let pageNumber =   Math.ceil( (this.postList.length / 5) * (-1)) * (-1);
      // console.log(`postlist.length = ${this.postList.length}`);
      // console.log(`pageNumber = ${pageNumber}`);
      return pageNumber;
      
    }
  get srchBoxInput(){
    return this.postListForm.get('srchBoxInput')?.value;
  }

}
