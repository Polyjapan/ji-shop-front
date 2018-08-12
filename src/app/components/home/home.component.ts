import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {BackendService} from '../../services/backend.service';
import {ItemList, ItemsResponse} from '../../types/items';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  goodies: ItemList[] = null;
  tickets: ItemList[] = null;

  constructor(public backend: BackendService) {
  }


  ngOnInit(): void {
    this.backend.getItems().subscribe(
      resp => {
          this.goodies = resp.goodies;
          this.tickets = resp.tickets;
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
}
