import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { List } from 'lodash';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, fromEvent, map, switchMap } from 'rxjs';
import { PostService } from '../service/post-service';
import { PostEntity } from '../model/post/post-entity';
import { UserEntity } from '../model/user/user-entity';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  postCreateFrm: FormGroup<any>;
  tags: Array<string> = [];
  links: Array<string> = [];
  constructor(private service :PostService) {
    this.postCreateFrm = new FormGroup({
      titleTxt: new FormControl('', [Validators.required]),
      tagTxt: new FormControl('', [Validators.required]),
      bodyTxt: new FormControl('',[Validators.required]),
      linkTxt: new FormControl('', [Validators.required])
  });
}
ngOnInit() {

  this.handleTags();
  this.handleLinks();
  this.handleCreatPost();
}
  handleCreatPost() {
   //elems
    const titleTxt = document.getElementById('title-txt') as HTMLInputElement;
    const bodyTxt = document.getElementById('body-txt') as HTMLInputElement;
    const visibleChbox = document.getElementById('is-visible') as HTMLInputElement;
    const createPostSubmitBtn = document.getElementById('create-post-submit-btn') as HTMLElement;
    const errorBoxDiv=document.getElementById('errorBoxDiv') as HTMLElement;
        //source
        const createSubmit$ = fromEvent(createPostSubmitBtn,'click');

        createSubmit$.pipe(
          debounceTime(1000),
          map(()=> 
            {
              const author=new UserEntity();
              author._id="64838a1dad3e7d49154ca051";
              author.name="xxx";
              const x = new PostEntity(titleTxt.value,bodyTxt.value,0,'1111',new Date(),visibleChbox.checked,author,this.tags,this.links);
              return x;
            }
            ),debounceTime(1000),
    
          // distinctUntilChanged((pre,curr) => {
          //   if(pre.name == curr.name && pre.password == curr.password)
          //   return true;
          //   return false;
          // }),
          switchMap( (params)=> {
             return this.service.add(params)
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
      console.log(str);
      this.links.push(str);
      this.link = "";
      
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
  }),distinctUntilChanged()
  )
  .subscribe((value:any) => {
    let str = `#${value}`
    this.tags.push(str);
    this.tag = "";
    tagContainerDiv.innerHTML = tagContainerDiv.innerHTML + '<span class="inline-flex items-center rounded-md h-10 m-1 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">'+str+'</span>';
  });
  }
get title() {
  return this.postCreateFrm.get('titleTxt');
}
get tag() {
  return this.postCreateFrm.get('tagTxt')?.value;
}

set tag(value:any) {

   this.postCreateFrm.get('tagTxt')?.setValue(value);
}

get body() {
  return this.postCreateFrm.get('bodyTxt');
}

get link() {
  return this.postCreateFrm.get('linkTxt')?.value;
}

set link(value:any) {
   this.postCreateFrm.get('linkTxt')?.setValue(value);
}
}
