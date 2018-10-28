import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../../../types/client';

@Component({
  selector: 'app-admin-list-users',
  templateUrl: './admin-list-users.component.html'
})
export class AdminListUsersComponent implements OnInit {
  private users: Client[];
  nameFilter: string;
  mailFilter: string;

  constructor(private backend: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.backend.getClients().subscribe(users => {
      this.users = users;
    });
  }

  get filteredUsers() {
    if (!this.users) {
      return this.users;
    }
    return this.users.filter(client => {
      if (this.nameFilter && (client.firstname + ' ' + client.lastname).indexOf(this.nameFilter) === -1) {
        return false;
      }

      if (this.mailFilter && client.email.indexOf(this.mailFilter) === -1) {
        return false;
      }

      return true;
    });
  }
}
