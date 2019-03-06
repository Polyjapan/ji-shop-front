import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';


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

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) {

  }

  onRegister(form: NgForm) {
    this.registerErrors = null;
    this.registerSent = true;

    // @ts-ignore
    declare var grecaptcha: any;

    const data = form.value;
    data['captcha'] = grecaptcha.getResponse();

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
  }

  onLogin(form: NgForm) {
    this.loginErrors = null;
    this.loginSent = true;

    this.backend.login(form.value).subscribe(
      res => {
        console.log(res);
        this.auth.login(res.auth_token, res.refresh_token);
        this.loginSent = false;
      },
      err => {
        console.log(err);
        this.loginErrors = Errors.replaceErrorsInResponse(err, new Map<string, string>([
          [ErrorCodes.NOT_FOUND, 'Cette combinaison email/mot de passe n\'existe pas.'],
          [ErrorCodes.EMAIL_NOT_CONFIRMED, 'Vous devez confirmer votre adresse email pour continuer.'],
        ]), new Map<string, string>([
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
  }
}
