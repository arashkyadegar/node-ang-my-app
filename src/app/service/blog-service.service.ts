import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { BlogEntity } from '../model/blog/blog-entity';
import { tap, Observable, pipe, Subscription } from "rxjs";
import { map } from 'rxjs/operators';
import { UserEntity } from "../model/user/user-entity";
import { PostEntity } from "../model/post/post-entity";
import { ajax } from "rxjs/ajax";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient){

  }
  search(title:string,pageNo:number):Observable<object> {
    let blogs=new Array<BlogEntity>;
    const source$= this.http.get('http://localhost:8000/blogs/search?title='+title +'&page=' +  pageNo);
    return source$;
  }
   find(title:string,pageNo:number): Observable<object> {

    let blogs=new Array<BlogEntity>;
    const source$= this.http.get('http://localhost:8000/blogs/search?title='+title +'&page=' +  pageNo);
    return source$;
  }
  edit(blog: BlogEntity,id:number):number {
        throw Error;
  }
  
  add(blog:BlogEntity):Observable<object>  {
    //add to db
    const source$=this.http.post('http://localhost:8000/blogs',blog).pipe(tap(// Log the result or error
    {
      next: (data) => console.log('next', data),
      error: (error) => console.error('error', error)
    })
  );
  return source$;

  }

  remove(id:number):boolean {
    return true;
  }

  getList():Array<BlogEntity> {
    throw Error;
  }
  
  getOne(id:number):BlogEntity {
    throw Error;
  }
  findOneAndAddNewPosts(blogId:string,posts:Array<PostEntity>):Observable<object>{
    //add to db
    let url = 'http://localhost:8000/blogs/'+blogId+'/posts/1';
    const source$=this.http.post(url,posts)
    .pipe(tap(// Log the result or error
    {
      next: (data) => console.log('next', data),
      error: (error) => console.error('error', error)
    })
  );
  return source$;

  }
}
