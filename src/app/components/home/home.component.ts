import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';
import {Observable} from 'rxjs/Rx';
import {Permissions} from '../../constants/permissions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  goodies: ItemList[] = null;
  tickets: ItemList[] = null;
  loading = true;

  constructor(public backend: BackendService, private auth: AuthService) {
  }


  ngOnInit(): void {
    let observable: Observable<ItemsResponse>;

    if (this.auth.hasPermission(Permissions.SEE_INVISIBLE_ITEMS)) {
      observable = this.backend.getAllItems();
    } else {
      observable = this.backend.getItems();
    }

    observable.subscribe(
      resp => {
        this.goodies = resp.goodies;
        this.tickets = resp.tickets;
        this.loading = false;
      }
    );
  }

  hasContent(): boolean {
    return this.goodies && this.tickets && !(this.goodies.length === 0 && this.tickets.length === 0);
  }

  hasTickets(): boolean {
    return this.tickets && this.tickets.length > 0;
  }

  hasGoodies(): boolean {
    return this.goodies && this.goodies.length > 0;
  }

  get isAdmin() {
    return this.auth.hasPermission(Permissions.GIVE_FOR_FREE);
  }
}
