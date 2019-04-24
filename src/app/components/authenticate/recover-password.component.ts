import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import * as Errors from '../../constants/errors';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {ErrorCodes} from '../../constants/errors';
import {AuthService} from '../../services/auth.service';
import {AuthApiService} from '../../services/authapi.service';

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
        // TODO: handle errors

        this.errors = Errors.replaceErrorsInResponse(err,
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
