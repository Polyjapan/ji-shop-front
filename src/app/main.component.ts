import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import {Permissions} from './constants/permissions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  Permissions = Permissions;

  constructor(public auth: AuthService) {
  }
}
