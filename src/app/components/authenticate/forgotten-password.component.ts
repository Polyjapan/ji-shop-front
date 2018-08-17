import {Component} from '@angular/core';
import {Permissions} from '../../constants/permissions';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html'
})
export class ForgottenPasswordComponent {
  errors: string[];
  sent = false;
  sending = false;

  constructor(private backend: BackendService) {}

  resetPassword(form: NgForm) {
    declare var grecaptcha: any;

    this.backend.passwordRecover(form.value.email, grecaptcha.getResponse()).subscribe(
      success => console.log('ok ' + success),
      err => console.log('error ' + err)
    );
  }
}
