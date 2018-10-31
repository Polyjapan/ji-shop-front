import {Component} from '@angular/core';
import {NavigationComponent} from '../../../abstraction/navigation-component';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from '../../sidebar/menuitem';

@Component({
  selector: 'app-intranet-event',
  templateUrl: './intranet-event.component.html',
  styleUrls: ['./intranet-event.component.css']
})
export class IntranetEventComponent {
  menu: MenuItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.menu.push(new MenuItem('opened', 'Tâches ouvertes', 'folder-open'));
    this.menu.push(new MenuItem('closed', 'Tâches fermées', 'folder'));
    this.menu.push(new MenuItem('my', 'Mes tâches', 'user'));
    this.menu.push(new MenuItem('create', 'Créer une tâche', 'plus-circle'));
  }

}
