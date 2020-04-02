import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {AuthApiError, AuthApiService, LoginErrorCodes} from '../../services/authapi.service';

@Component({
  selector: 'app-firstlogin',
  templateUrl: './firstlogin.component.html'
})
export class FirstloginComponent implements OnInit {
  registerErrors: string[] = null;
  registerSent = false;

  private token: string;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) {
  }

  onRegister(form: NgForm) {
    this.registerErrors = null;
    this.registerSent = true;


  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else if (!this.auth.temporaryToken) {
      this.router.navigate(['login']);
    } else {
      this.token = this.auth.temporaryToken;
    }
  }
}
