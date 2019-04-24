import {Component, OnInit} from '@angular/core';
import {Permissions} from '../../constants/permissions';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import * as Errors from '../../constants/errors';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {AuthApiService} from '../../services/authapi.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html'
})
export class ForgottenPasswordComponent implements OnInit {
  errors: string[];
  sent = false;
  sending = false;

  constructor(private authApi: AuthApiService, private router: Router, private auth: AuthService) {
  }

  resetPassword(form: NgForm) {
    // @ts-ignore
    declare var grecaptcha: any;
    this.sending = true;

    this.authApi.forgotPassword(form.value.email, grecaptcha.getResponse()).subscribe(
      success => {
        this.sent = true;
      },
      err => {
        // TODO: handle errors
        this.errors = Errors.replaceErrorsInResponse(err);
        this.sending = false;
      });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
}
