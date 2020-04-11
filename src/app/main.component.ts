import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';
import {Permissions} from './constants/permissions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  Permissions = Permissions;

  constructor(public auth: AuthService) {
  }
}
