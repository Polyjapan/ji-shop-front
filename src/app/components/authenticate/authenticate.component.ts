import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {NgForm} from '@angular/forms';
import {ApiError} from '../../types/api_result';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent {
  registerErrors: ApiError[] = null;
  loginErrors: ApiError[] = null;

  registerOk = false;

  constructor(private backend: BackendService) {

  }

  onRegister(form: NgForm) {
    console.log(form.value);
    this.registerErrors = null;


    this.backend.register(form.value).subscribe(
      res => this.registerOk = true,
      err => {
        this.registerErrors = err.error.errors;
      }
    );
  }
}
