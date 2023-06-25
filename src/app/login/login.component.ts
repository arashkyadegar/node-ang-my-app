import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import {EMPTY, catchError, debounceTime, distinctUntilChanged, empty, fromEvent, map, mergeMap, of, switchMap, tap} from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { values } from 'lodash';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cookieValue: any;

  constructor(private service :LoginService,private cookieService:CookieService){};
  ngOnInit() {  
    //ids in html must contains - sample : login-submit in html and loginSubmit in js
    //elems
    const loginSubmitBtn=document.getElementById('loginSubmit') as HTMLElement;
    const nameTxt=document.getElementById('nameTxt') as HTMLInputElement ;
    const passwordTxt=document.getElementById('passwordTxt') as HTMLInputElement ;
    const errorBoxDiv=document.getElementById('errorBoxDiv') as HTMLElement;
    const rememberChbox=document.getElementById('rememberChbox') as HTMLInputElement;

    //source
    const loginSubmit$=fromEvent(loginSubmitBtn,'click');
    loginSubmit$.pipe(
      debounceTime(1000),
      map(()=> 
        ({name: nameTxt.value,
        password:passwordTxt.value,
        rememberUser:rememberChbox.checked})),

      distinctUntilChanged((pre,curr) => {
        if(pre.name == curr.name && pre.password == curr.password)
        return true;
        return false;
      }),
      switchMap( (params)=> {
         return this.service.login(params.name,params.password,params.rememberUser)
          .pipe (
            catchError(err => {
              errorBoxDiv.classList.remove("invisible");
              switch (err.status) {
                case 401:
                  errorBoxDiv.innerHTML='<p>wrong username or password.</p>';
                  break;
                default:
                    errorBoxDiv.innerHTML='<p>smth wrong happend.</p>';
              }
              return EMPTY;
            })
          )
      })
      )
      .subscribe((rslt:any) => {
        this.cookieValue = this.cookieService.get('user-cookie'); // To Get Cookie
        errorBoxDiv.classList.add("invisible");
        console.log(`successful ${rslt.name}`);
        console.log(`token ${rslt.token}`);
      })
    }
  submit() {}

}


