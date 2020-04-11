import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthApiService} from './authapi.service';


export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  providers: [
    AuthService,
    AuthApiService
  ]
})
export class AuthModule {
}
