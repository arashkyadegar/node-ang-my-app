import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { BlogEntity } from '../model/blog/blog-entity';
import { tap, Observable, pipe, Subscription } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient){

  }
   find(): Observable<object> {
    let blogs=new Array<BlogEntity>;
    const source$=  this.http.get('http://localhost:8000/blogs').pipe(
      tap(// Log the result or error
      {
        next: (data) => console.log('next', data),
        error: (error) => console.error('error', error)
      })
    );
    return source$;
  }
  edit(blog: BlogEntity,id:number):number {
        throw Error;
  }
  
  add(blog:BlogEntity):number  {
    //add to db
    return blog._id;
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
}
