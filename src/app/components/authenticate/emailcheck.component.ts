import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {AuthApiError, AuthApiService, EmailConfirmErrorCodes, LoginErrorCodes} from '../../services/authapi.service';

@Component({
  selector: 'app-emailcheck',
  templateUrl: './emailcheck.component.html'
})
export class EmailcheckComponent implements OnInit {
  loading = true;
  success: boolean;
  errors: string[] = [];
  returnUrl = '/';

  constructor(private route: ActivatedRoute, private authApi: AuthApiService, private backend: BackendService, private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      const params = this.route.snapshot.paramMap;
      const email = params.get('email');
      const code = params.get('code');


      this.authApi.emailConfirm(email, code).subscribe(apiSuccess => {
        this.backend.login(apiSuccess.ticket).subscribe(
          res => {
            console.log(res);
            this.loading = false;
            this.success = res.success;
            this.returnUrl = this.auth.login(res, false);
          },
          err => {
            console.log(err);
            this.errors = Errors.replaceErrorsInResponse(err, new Map<string, string>([]), new Map<string, string>([]));
            this.loading = false;
          }
        );
      }, err => {
        try {
          const ec = (err.error as AuthApiError).errorCode;

          switch (ec) {
            case EmailConfirmErrorCodes.InvalidConfirmCode:
              this.errors = ['Le code de confirmation ou l\'email est incorrect'];
              break;
            default:
              this.errors = [AuthApiService.parseGeneralError(ec)];
          }
        } catch (e) {
          this.errors = [AuthApiService.parseGeneralError(200)];
          console.log(e);
        }

        this.loading = false;
      });
    }
  }
}
