import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';
import {AuthApiService} from './authapi.service';
import {AuthInterceptor} from './auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';



export function tokenGetter() {
  return localStorage.getItem('id_token');
}

@NgModule({
  providers: [
    AuthService,
    AuthApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {}
