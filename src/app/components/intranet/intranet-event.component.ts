import {Component} from '@angular/core';
import {NavigationComponent} from '../../abstraction/navigation-component';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from '../admin/admin.component';

@Component({
  selector: 'app-intranet-event',
  templateUrl: './intranet-event.component.html',
  styleUrls: ['./intranet-event.component.css']
})
export class IntranetEventComponent {
  menu: MenuItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menu.push(new MenuItem('.', 'home', 'Vue générale', 'home'));
    this.menu.push(new MenuItem('my', 'my', 'Mes tâches', 'user'));
    this.menu.push(new MenuItem('closed', 'closed', 'Tâches fermées', 'folder'));
    this.menu.push(new MenuItem('create', 'create', 'Créer une tâche', 'plus-circle'));
  }

}
