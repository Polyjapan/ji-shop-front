import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';
import {RefreshTokenInterceptor} from './refres-token-interceptor.service';



export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  providers: [
    AuthService,
    RefreshTokenInterceptor
  ]
})
export class AuthModule {}
