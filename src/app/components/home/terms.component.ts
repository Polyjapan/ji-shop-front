import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {Observable} from 'rxjs';
import {Permissions} from '../../constants/permissions';
import {replaceErrorsInResponse} from '../../constants/errors';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent {
}
