import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(_name:string,_password:string,_remember:boolean): Observable<object> {
    let url = 'http://localhost:8000/auth/login/';
    const source$=  this.http.post<any>(url,{name:_name,password:_password,remember:_remember})
    .pipe(
      // tap(// Log the result or error
      // {
      //   next: (data) => console.log('next', data),
      //   error: (error) => console.error('error', error)
      // })
    )
    return source$;
  }
}
