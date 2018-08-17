import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
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
    console.log(form.value);
    this.registerErrors = null;
    this.registerSent = true;


    this.backend.register(form.value).subscribe(
      res => {
        this.registerOk = true;
        this.registerSent = false;
        },
      err => {
        this.registerErrors = Errors.replaceErrors(err.error.errors, new Map<string, string>([
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
        this.loginErrors = Errors.replaceErrors(err.error.errors, new Map<string, string>([
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
