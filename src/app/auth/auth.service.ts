import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {AuthData} from './auth-data.model';
import { environment } from '../../environments/environment';
 const BACKED_URL = environment.apiUrl + '/user';

@Injectable({providedIn: 'root'})
export class AuthService{
  private token!: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId!: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  createUser(email:string, password: string){
    const authData: AuthData={email: email, password: password};
    return this.http.post(BACKED_URL+'/singup', authData)
        .subscribe(() => {
          this.router.navigate(['/']);
        }, error => {
          this.authStatusListener.next(false);
        });
  }
  login(email: string, password: string){
    const authData: AuthData={email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKED_URL+ '/login', authData)
        .subscribe(response => {
         const token = response.token;
         this.token = token;
         if(token){
           const expiresInDuration = response.expiresIn;
           this.setAuthTimer(expiresInDuration);
         this.isAuthenticated = true;
         this.userId = response.userId;
         this.authStatusListener.next(true);
         const now = new Date();
         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
         console.log(expirationDate);
         this.saveAuthData(token,expirationDate, this.userId);
         this.router.navigate(['/']);
         }
        }, error =>{
          this.authStatusListener.next(false);
        });

  }

  autoAuthUser(){
    const authInformation: any = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout(){
    this.token = ' ';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.userId = '';
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log('setting timer:' + duration);
    this.tokenTimer = setTimeout(() =>{
      this.logout();

    }, duration * 1000);

  }
  private saveAuthData(token: string, expiresInDuration: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiresInDuration.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');

  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
     return ;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId : userId
    }
  }
}
