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
    this.route.queryParamMap.subscribe(pmap => {
      const pm = pmap.params;
      console.log(pm);

      if (pm['action'] === 'confirmEmail' && pm['confirmCode'] && pm['email']) {
        this.router.navigate(['/', 'emailConfirm', pm['email'], pm['confirmCode']]);
      } else if (pm['action'] === 'passwordReset' && pm['resetCode'] && pm['email']) {
        this.router.navigate(['/', 'passwordReset', pm['email'], pm['resetCode']]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
