import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {AuthApiService} from '../../services/authapi.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent implements OnInit {
  loginSent = false;

  loginErrors: string[] = null;
  requiresInfo: true;
  tempSession: string;

  constructor(private backend: BackendService, private authApi: AuthApiService, public auth: AuthService, private router: Router,
              private ar: ActivatedRoute) {

  }

  onRegister(form: NgForm) {
    if (this.loginSent) {
      return;
    }

    this.loginSent = true;
    const data = form.value;

    this.backend.firstLogin(data, this.tempSession).subscribe(apiSuccess => {
        console.log(apiSuccess);
        this.auth.login(apiSuccess);
        this.loginSent = false;
      },
      err => {
        this.loginErrors = Errors.replaceErrorsInResponse(err, new Map<string, string>([
          [ErrorCodes.USER_EXISTS, 'Un utilisateur avec cette adresse email existe déjà.'],
        ]), new Map<string, string>([
          ['ticket', 'Données d\'identification'],
        ]));

        this.loginSent = false;
      }
    );
  }

  onLoginToken(ticket: string) {
    if (this.loginSent) {
      return;
    }

    this.loginSent = true;

    this.backend.login(ticket).subscribe(
      res => {
        console.log(res);
        if (res.requireInfo) {
          this.requiresInfo = true;
          this.tempSession = res.idToken;
        } else {
          this.auth.login(res);
        }
        this.loginSent = false;
      },
      err => {
        console.log(err);
        this.loginErrors = Errors.replaceErrorsInResponse(err, new Map<string, string>([]), new Map<string, string>([
          ['email', 'Email'],
          ['password', 'Mot de passe'],
        ]));

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
