import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { PostService } from '../service/post-service';
import { PostEntity } from '../model/post/post-entity';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, fromEvent, map, switchMap } from 'rxjs';
import { UserEntity } from '../model/user/user-entity';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})

export class PostEditComponent {
  postEditFrm: FormGroup<any>;
  post!: PostEntity;
  imgurl="../../assets/" ; 
  tags: Array<string> = [];
  links: Array<string> = [];
  constructor(private service :PostService,private route: ActivatedRoute) {
    
    this.postEditFrm = new FormGroup({
      titleTxt: new FormControl('', [Validators.required]),
      tagTxt: new FormControl('', [Validators.required]),
      bodyTxt: new FormControl('',[Validators.required]),
      linkTxt: new FormControl('', [Validators.required]),
      isVisible:  new FormControl('',[Validators.required])
  });
}
ngOnInit() {
  const postId = this.route.snapshot.paramMap.get('id');
  if(postId != undefined){
    const blogs$ = this.service.findOne(postId);    
    blogs$.subscribe((reponse: any) => {
      this.title = reponse.title;
      this.body = reponse.body;
      this.isVisible = reponse.isVisible;
      this.fillTags(reponse.tags);
      this.fillLinks(reponse.links);
    });
  }

  this.handleTags();
  this.handleLinks();
  this.handleEditPost();
}
handleLinks() {
    //elems
  const linkInput=document.getElementById('link-txt') as HTMLElement;
  const linkAddBtn = document.getElementById('link-add-btn') as HTMLElement ;
  const linksContainerDiv = document.getElementById('links-container-div') as HTMLElement ;

  //source
  const linkAddBtn$ = fromEvent(linkAddBtn,'click');

  linkAddBtn$.pipe(
    map( () => {
    const link = this.link;
    return link;
  }),distinctUntilChanged()
  )
  .subscribe((value:any) => {
    let str = `${value}`;
    this.links.push(str);
    this.link = "";
    console.log(this.links);
    linksContainerDiv.innerHTML =  linksContainerDiv.innerHTML +'<div class="flex border border-gray-200 items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">'+
      '<div class="ml-4 flex min-w-0 flex-1 gap-2">'+
      '<span class="truncate font-medium">'+str+'</span>'+
      '</div>'+
      '<div class="ml-4 flex-shrink-0">'+
      '<a href="#" class="font-medium text-red-600 hover:text-red-500">حذف</a>'+
      '</div>'+
      '</div>'
  });
}
handleTags() {
    //elems
  const tagInput = document.getElementById('tag-txt') as HTMLElement;
  const tagAddbtn = document.getElementById('tag-add-btn') as HTMLElement;
  const tagContainerDiv = document.getElementById('tags-container-div') as HTMLElement;

  //source
  const tagAddbtn$=fromEvent(tagAddbtn,'click');

  tagAddbtn$.pipe(
    map( () => {
      const tag = this.tag;
      return tag;
      }
    ),distinctUntilChanged()
  )
  .subscribe((value: any) => {
    let str = `#${value}`
    this.tags.push(str);
    this.tag = "";
    console.log(this.tags);
    tagContainerDiv.innerHTML = tagContainerDiv.innerHTML + '<span class="inline-flex items-center rounded-md h-10 m-1 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">'+str+'</span>';
  });
}
fillLinks(links: string[]) {
  this.links=links;
  const linksContainerDiv = document.getElementById('links-container-div') as HTMLElement ;
  links.forEach(element => {
    linksContainerDiv.innerHTML =  linksContainerDiv.innerHTML +'<div class="flex border border-gray-200 items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">'+
      '<div class="ml-4 flex min-w-0 flex-1 gap-2">'+
      '<span class="truncate font-medium">'+element+'</span>'+
      '</div>'+
      '<div class="ml-4 flex-shrink-0">'+
      '<a href="#" class="font-medium text-red-600 hover:text-red-500">حذف</a>'+
      '</div>'+
      '</div>'
  });
 }
fillTags(tags: string[]) {
  this.tags=tags;
  const tagContainerDiv = document.getElementById('tags-container-div') as HTMLElement;
    tags.
      forEach(element => {
        tagContainerDiv.innerHTML = tagContainerDiv.innerHTML + '<span class="inline-flex items-center rounded-md h-10 m-1 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">' + element + '</span>';
      });  
}
handleEditPost() {
  //elems
   const postId = this.route.snapshot.paramMap.get('id')!;
   const titleTxt = document.getElementById('title-txt') as HTMLInputElement;
   const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
   const isVixibleChBox = document.getElementById('is-visible') as HTMLInputElement;
   const editPostSubmitBtn = document.getElementById('edit-post-submit-btn') as HTMLElement;
   const errorBoxDiv=document.getElementById('errorBoxDiv') as HTMLElement;
       //source
       const createSubmit$ = fromEvent(editPostSubmitBtn,'click');

       createSubmit$.pipe(
         debounceTime(1000),
         map(()=> 
           {
             const author=new UserEntity();
             author._id="64838a1dad3e7d49154ca051";
             author.name="xxx";
             const x = new PostEntity(titleTxt.value,bodyTxt.value,0,'1111',new Date(),isVixibleChBox.checked,author,this.tags,this.links);
             return x;
           }
           ),debounceTime(1000),
         switchMap( (params)=> {
            return this.service.edit(postId,params)
             .pipe (
               catchError(err => {
                 errorBoxDiv.classList.remove("invisible");
                 switch (err.status) {
                   default:
                       errorBoxDiv.innerHTML='<p>smth wrong happend.</p>';
                 }
                 return EMPTY;
               })
             )
         })
         ).subscribe(console.log)

 }

onReset(): void {}
get f() {
  return this.postEditFrm.controls;
} 
get title() {
  return this.postEditFrm.get('titleTxt');
}

set title(value: any) {

  this.postEditFrm.get('titleTxt')?.setValue(value);
}

get tag() {
  return this.postEditFrm.get('tagTxt')?.value;
}

set tag(value: any) {

   this.postEditFrm.get('tagTxt')?.setValue(value);
}

get body() {
  return this.postEditFrm.get('bodyTxt');
}

set body(value: any) {
   this.postEditFrm.get('bodyTxt')?.setValue(value);;
}

get isVisible() {
  return this.postEditFrm.get('is-visible');
}

set isVisible(value: any) {
  (<HTMLInputElement>document.getElementById('is-visible')).checked = value ;
}

get link() {
  return this.postEditFrm.get('linkTxt')?.value;
}

set link(value: any) {
   this.postEditFrm.get('linkTxt')?.setValue(value);
}
}