import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import * as Errors from '../../constants/errors';
import {ActivatedRoute} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {ErrorCodes} from '../../constants/errors';

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

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  resetPassword(form: HTMLInputElement) {
    this.sending = true;

    this.backend.passwordReset(this.email, this.code, form.value).subscribe(
      success => {
        if (success.success) {
          this.sent = true;
        } else {
          this.errors = Errors.replaceErrors(success.errors,
            new Map([[ErrorCodes.NOT_FOUND, 'Cette demande de réinitialisation de mot de passe n\'a pas été trouvée']]),
            new Map([['password', 'Mot de passe']])
          );
          this.sending = false;
        }
      },
      err => {
        this.errors = Errors.replaceErrors(err.error.errors,
          new Map([[ErrorCodes.NOT_FOUND, 'Cette demande de réinitialisation de mot de passe n\'a pas été trouvée']],),
          new Map([['password', 'Mot de passe']])
        );

        this.sending = false;
      }
    );
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
