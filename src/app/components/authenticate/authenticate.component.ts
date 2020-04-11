import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {AuthApiService} from '../../services/authapi.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent implements OnInit {
  loginSent = false;
  loginErrors: string[] = null;

  constructor(private backend: BackendService, private authApi: AuthApiService, public auth: AuthService, private router: Router,
              private ar: ActivatedRoute) {

  }

  onLoginToken(ticket: string) {
    if (this.loginSent) {
      return;
    }

    this.loginSent = true;

    this.backend.login(ticket).subscribe(
      res => {
        this.auth.login(res);
        this.loginSent = false;
      },
      err => {
        console.log(err);
        this.loginErrors = Errors.replaceErrorsInResponse(err);
        this.loginSent = false;
      }
    );
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.ar.queryParamMap.subscribe(qpm => {
      if (qpm.has('ticket')) {
        this.onLoginToken(qpm.get('ticket'));
      } else {
        this.router.navigateByUrl(this.auth.loginUrl());
      }
    });
  }
}
