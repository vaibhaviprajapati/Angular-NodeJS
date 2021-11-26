import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscriber, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = true;
  private authStatussub !: Subscription
  constructor(public authService : AuthService) { }
  ngOnInit(){
    this.authStatussub = this.authService
    .getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

  }
  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)


  }

  ngOnDestroy(){
    this.authStatussub.unsubscribe();
  }
}