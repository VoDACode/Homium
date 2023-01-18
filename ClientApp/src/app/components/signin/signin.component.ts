import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthService } from 'src/app/services/api/api-auth.service';
import { SigninData } from 'src/app/types/SigninData';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  data: SigninData = new SigninData("", "");

  constructor(private authApi: ApiAuthService, private router: Router) { 
    this.authApi.isAuthenticated.then(response => {
      if (response) {
        this.router.navigate([""]);
      }
    });
  }

  ngOnInit(): void {
  }

  public signIn(): void {
    this.authApi.signIn(this.data).then(response => {
      console.log(response);
      if (response.ok) {
        this.router.navigate([""]);
      } else {
        console.log("Sign in failed");
      }
    });
  }
}
