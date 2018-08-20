import {Component, OnInit} from '@angular/core';
import {Permissions} from '../../constants/permissions';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import * as Errors from '../../constants/errors';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html'
})
export class ForgottenPasswordComponent implements OnInit {
  errors: string[];
  sent = false;
  sending = false;

  constructor(private backend: BackendService) {
  }

  resetPassword(form: NgForm) {
    declare var grecaptcha: any;
    this.sending = true;

    this.backend.passwordRecover(form.value.email, grecaptcha.getResponse()).subscribe(
      success => {
        if (success.success) {
          this.sent = true;
        } else {
          this.errors = Errors.replaceErrors(success.errors);
          this.sending = false;
        }
      },
      err => {
        this.errors = Errors.replaceErrors(err.error.errors);
        this.sending = false;
      });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
