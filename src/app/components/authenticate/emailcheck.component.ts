import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';

@Component({
  selector: 'app-emailcheck',
  templateUrl: './emailcheck.component.html'
})
export class EmailcheckComponent implements OnInit {
  loading = true;
  success: boolean;
  errors: string[] = [];
  returnUrl: string;

  constructor(private route: ActivatedRoute, private backend: BackendService, private router: Router, private auth: AuthService) {

  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      const params = this.route.snapshot.paramMap;
      const email = params.get('email');
      const code = params.get('code');

      this.backend.emailConfirm(email, code).subscribe(
        result => {
          this.success = result.success;
          this.loading = false;

          for (const err of result.errors) {
            const apiErr = err as ApiError;
            for (const msg of apiErr.messages) {
              this.errors.push(msg);
            }
          }

          this.auth.login(result.token, false);
        },
        error => {
          this.loading = false;
          this.errors = Errors.replaceErrorsInResponse(error, new Map<string, string>([
            [ErrorCodes.NOT_FOUND, '{key} n\'a pas été trouvé.'],
          ]), new Map<string, string>([
            ['email', 'Cet email'],
            ['code', 'Ce code de confirmation'],
          ]));


          for (const err of error.error.errors) {
            const apiErr = err as ApiError;
            for (const msg of apiErr.messages) {
              this.errors.push(msg);
            }
          }
        }
      )
    }
  }
}
