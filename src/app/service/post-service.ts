import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { BlogEntity } from '../model/blog/blog-entity';
import { tap, Observable, pipe, Subscription } from "rxjs";
import { map } from 'rxjs/operators';
import { PostEntity } from "../model/post/post-entity";

@Injectable({
    providedIn: 'root'
  })
export class PostService {

  advanceSearch(title: string, pageNo: number, isVisible: boolean): any {
    let url = `http://localhost:8000/posts/search?title=${title}&page=${pageNo}&visible=${isVisible}`;
    //const source$= this.http.get('http://localhost:8000/blogs/search?title='+title +'&page=' +  pageNo);

    const source$=  this.http.get(url).pipe(
    );
    return source$;
  }
  search(title: string, pageNo: number, isVisible: boolean): any {
    let url = `http://localhost:8000/posts/search?title=${title}&page=${pageNo}&visible=${isVisible}`;
    //const source$= this.http.get('http://localhost:8000/blogs/search?title='+title +'&page=' +  pageNo);

    const source$=  this.http.get(url).pipe(
    );
    return source$;
  }

    constructor(private http: HttpClient){

    }

    edit(id: string,post: PostEntity) {
      const source$ = this.http.post(`http://localhost:8000/posts/${id}`,post)
      .pipe(
        tap(// Log the result or error
          {
            next: (data) => console.log('next', data),
            error: (error) => console.error('error', error)
          })
      );
      return source$;
    }
    find(pageNo: number): Observable<object> {
      let url = `http://localhost:8000/posts/?page=${pageNo}`;
      //const source$= this.http.get('http://localhost:8000/blogs/search?title='+title +'&page=' +  pageNo);

      const source$=  this.http.get(url).pipe(
      );
      return source$;
    }

  findOne(id:string): Observable<object> {
    let url = `http://localhost:8000/posts/${id}`;
    const source$=  this.http.get(url).pipe(

    );
    return source$;
  }

  add(post:PostEntity):Observable<object>  {
    //add to db
    const source$=this.http.post('http://localhost:8000/posts',post)
    .pipe(
      tap(// Log the result or error
        {
          next: (data) => console.log('next', data),
          error: (error) => console.error('error', error)
        })
    );
    return source$;
    }

    deleteOne(id:string): Observable<object> {
      const source$=this.http.delete(`http://localhost:8000/posts/${id}`)
        .pipe(
          tap(// Log the result or error
          {
            next: (data) => console.log('next', data),
            error: (error) => console.error('error', error)
          })
        );
      return source$;
    }
}
