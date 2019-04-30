import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {AuthApiError, AuthApiService, LoginErrorCodes} from '../../services/authapi.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent implements OnInit {
  registerErrors: string[] = null;
  loginErrors: string[] = null;
  loginSent = false;
  registerSent = false;

  registerOk = false;

  constructor(private backend: BackendService, private authApi: AuthApiService, private auth: AuthService, private router: Router) {

  }

  onRegister(form: NgForm) {
    this.registerErrors = null;
    this.registerSent = true;

    // @ts-ignore
    declare var grecaptcha: any;

    const data = form.value;
    data['captcha'] = grecaptcha.getResponse();

    this.authApi.register(data).subscribe(apiSuccess => {
      data['password'] = undefined;
      data['ticket'] = apiSuccess.ticket;

      this.backend.register(data).subscribe(
        res => {
          this.registerOk = true;
          this.registerSent = false;
        },
        err => {
          this.registerErrors = Errors.replaceErrorsInResponse(err, new Map<string, string>([
            [ErrorCodes.USER_EXISTS, 'Un utilisateur avec cette adresse email existe déjà.'],
          ]), new Map<string, string>([
            ['firstname', 'Prénom'],
            ['lastname', 'Nom'],
            ['email', 'Email'],
            ['password', 'Mot de passe'],
          ]));

          this.registerSent = false;
        }
      );
    }, err => {
      try {
        const code = (err.error as AuthApiError).errorCode;
        this.registerErrors = [AuthApiService.parseGeneralError(code)];
      } catch (e) {
        this.registerErrors = [AuthApiService.parseGeneralError(100)];
        console.log(e);
      }

      this.registerSent = false;
    });
  }

  onLogin(form: NgForm) {
    this.loginErrors = null;
    this.loginSent = true;

    this.authApi.login(form.value).subscribe(apiSuccess => {
      this.backend.login(apiSuccess.ticket).subscribe(
        res => {
          console.log(res);
          this.auth.login(res);
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
    }, err => {
      try {
        const code = (err.error as AuthApiError).errorCode;

        switch (code) {
          case LoginErrorCodes.EmailNotConfirmed:
            this.loginErrors = ['Vous devez confirmer votre adresse email pour continuer.'];
            break;
          case LoginErrorCodes.UserOrPasswordInvalid:
            this.loginErrors = ['Email ou mot de passe incorrect.'];
            break;
          default:
            this.loginErrors = [AuthApiService.parseGeneralError(code)];
        }
      } catch (e) {
        this.loginErrors = [AuthApiService.parseGeneralError(100)];
        console.log(e);
      }

      this.loginSent = false;
    });
  }


  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
