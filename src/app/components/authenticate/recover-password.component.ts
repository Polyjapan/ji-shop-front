import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {AuthService} from '../../services/auth.service';
import {AuthApiError, AuthApiService, PasswordResetErrorCodes} from '../../services/authapi.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent implements OnInit {
  errors: string[];
  sent = false;
  sending = false;

  email: string;
  code: string;

  constructor(private backend: BackendService, private authApi: AuthApiService, private route: ActivatedRoute, private router: Router, private auth: AuthService) {
  }

  resetPassword(form: HTMLInputElement) {
    this.sending = true;

    this.authApi.passwordReset(this.email, this.code, form.value).subscribe(
      success => {
        this.sent = true;
      },
      err => {
        try {
          const code = (err.error as AuthApiError).errorCode;

          if (code === PasswordResetErrorCodes.InvalidResetCode) {
            this.errors = ['Aucune demande de réinitialisation de mot de passe correspondante trouvée.'];
          } else {
            this.errors = [AuthApiService.parseGeneralError(code)];
          }
        } catch (e) {
          this.errors = [AuthApiService.parseGeneralError(100)];
          console.log(e);
        }
      });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {

      const params = this.route.snapshot.paramMap;

      this.email = params.get('email');
      this.code = params.get('code');

      if (isNullOrUndefined(this.email) || isNullOrUndefined(this.code)) {
        this.errors = ['Email ou code de réinitialisation manquant. Assurez vous d\'avoir cliqué sur un lien valide.'];
      }
    }
  }
}
