import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Permissions} from './constants/permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  Permissions = Permissions;

  constructor(public auth: AuthService) {
  }
}
