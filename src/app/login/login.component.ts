import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import {EMPTY, catchError, debounceTime, distinctUntilChanged, empty, fromEvent, map, mergeMap, of, switchMap, tap} from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cookieValue: any;

  constructor(private service :LoginService, private router: Router){};
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

      // distinctUntilChanged((pre,curr) => {
      //   if(pre.name == curr.name && pre.password == curr.password)
      //   return true;
      //   return false;
      // }),
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
       let redirectDelay =  setInterval(()=> {
          clearInterval(redirectDelay);
          this.router.navigate(['/home']);
        },1000)

        errorBoxDiv.classList.add("invisible");
      })
    }
  submit() {}

}


