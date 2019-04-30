import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {AuthApiError, AuthApiService, LoginErrorCodes} from '../../services/authapi.service';

@Component({
  selector: 'app-email-callback',
  template: ''
})
export class EmailCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(pm => {
      console.log(pm);

      if (pm.get('action') === 'confirmEmail' && pm.get('confirmCode') && pm.get('email')) {
        this.router.navigate(['/', 'emailConfirm', pm.get('email'), pm.get('confirmCode')]);
      } else if (pm.get('action') === 'passwordReset' && pm.get('resetCode') && pm.get('email')) {
        this.router.navigate(['/', 'passwordReset', pm.get('email'), pm.get('resetCode')]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
