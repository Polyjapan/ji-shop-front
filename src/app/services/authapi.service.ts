import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class AuthApiService {
  private baseApiUrl = environment.auth.apiurl + '/hidden/';
  private apiKey = environment.auth.clientId;
  private loginUrl = this.baseApiUrl + 'login';
  private registerUrl = this.baseApiUrl + 'register';
  private emailConfirmUrl = this.baseApiUrl + 'email_confirm';
  private forgotPasswordUrl = this.baseApiUrl + 'forgot_password';
  private passwordResetUrl = this.baseApiUrl + 'password_reset';

  constructor(private http: HttpClient) {
  }

  static parseGeneralError(code: number, other: Map<number, string> = new Map<number, string>()): string {
    switch (code) {
      case GeneralErrorCodes.MissingData:
        return 'Une erreur s\'est produite lors de l\'envoi des données au serveur.';
      case GeneralErrorCodes.InvalidCaptcha:
        return 'Le captcha est incorrect.';
      case GeneralErrorCodes.UnknownApp:
      case GeneralErrorCodes.InvalidAppSecret:
        return 'L\'application est mal configurée. Merci de revenir plus tard.';
      default:
        if (other.has(code)) {
          return other.get(code);
        }
        return 'Une erreur inconnue s\'est produite : ' + code;
    }
  }


  login(data: string): Observable<AuthApiSuccess> {
    data['clientId'] = this.apiKey;
    return this.http
      .post<AuthApiSuccess>(this.loginUrl, data);
  }

  register(data: any): Observable<AuthApiSuccess> {
    data['clientId'] = this.apiKey;
    return this.http
      .post<AuthApiSuccess>(this.registerUrl, data);
  }

  emailConfirm(user: string, code: string): Observable<AuthApiSuccess> {
    return this.http
      .post<AuthApiSuccess>(this.emailConfirmUrl, {'email': user, 'code': code, 'clientId': this.apiKey});
  }

  forgotPassword(mail: string, captcha: string): Observable<any> {
    return this.http
      .post(this.forgotPasswordUrl, {'email': mail, 'captcha': captcha, 'clientId': this.apiKey});
  }

  passwordReset(user: string, code: string, password: string): Observable<AuthApiSuccess> {
    return this.http
      .post<AuthApiSuccess>(this.passwordResetUrl, {'email': user, 'code': code, 'password': password, 'clientId': this.apiKey});
  }
}

export enum GeneralErrorCodes {
  UnknownError = 100,
  MissingData = 101,
  UnknownApp = 102,
  InvalidAppSecret = 103,
  InvalidCaptcha = 104
}

export enum LoginErrorCodes {
  UserOrPasswordInvalid = 201,
  EmailNotConfirmed = 202
}

export const loginErrorMessages = new Map<number, string>();
loginErrorMessages.set(LoginErrorCodes.UserOrPasswordInvalid, 'Nom d\'utilisateur ou mot de passe invalide.');
loginErrorMessages.set(LoginErrorCodes.EmailNotConfirmed, 'Votre email n\'est pas confirmé. Merci de confirmer ' +
  'votre email pour vous connecter.');

export enum RegisterErrorCodes {
  InvalidEmail = 201,
  PasswordTooShort = 202,
  PhoneInvalid = 203,
}

export const registerErrorMessages = new Map<number, string>();
registerErrorMessages.set(RegisterErrorCodes.InvalidEmail, 'Votre email est incorrect.');
registerErrorMessages.set(RegisterErrorCodes.PasswordTooShort, 'Votre mot de passe est trop court.');
registerErrorMessages.set(RegisterErrorCodes.PhoneInvalid, 'Numéro de télphone présent mais invalide.');

export enum EmailConfirmErrorCodes {
  InvalidConfirmCode = 201
}

export enum PasswordResetErrorCodes {
  InvalidResetCode = 201
}

export class AuthApiSuccess {
  ticket: string;
}

export class AuthApiError {
  errorCode: number;
}
