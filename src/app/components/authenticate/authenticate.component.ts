import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent implements OnInit {
  registerErrors: ApiError[] = null;
  loginErrors: ApiError[] = null;
  loginSent = false;
  registerSent = false;

  registerOk = false;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) {

  }

  onRegister(form: NgForm) {
    console.log(form.value);
    this.registerErrors = null;
    this.registerSent = true;


    this.backend.register(form.value).subscribe(
      res => {
        this.registerOk = true;
        this.registerSent = false;
        },
      err => {
        this.registerErrors = err.error.errors;
        this.registerSent = false;
      }
    );
  }

  onLogin(form: NgForm) {
    console.log(form.value);
    this.loginErrors = null;
    this.loginSent = true;

    this.backend.login(form.value).subscribe(
      res => {
        console.log(res);
        this.auth.login(res.token);
        alert('It\'s okay, It\'s alright, oh-oh');
        this.loginSent = false;
      },
      err => {
        this.loginErrors = err.error.errors;
        this.loginSent = false;
      }
    );
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
