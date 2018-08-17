import {Component} from '@angular/core';
import {Permissions} from '../../constants/permissions';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent {
  errors: string[];
  sent = false;
  sending = false;

  constructor(private backend: BackendService) {}

}
