import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';
import {EventListService} from '../event-list.service';

@Component({
  selector: 'app-admin-select-edition',
  templateUrl: './admin-select-edition.component.html',
  styleUrls: ['./admin-select-edition.component.css']
})
export class AdminSelectEditionComponent implements OnInit {
  editions: Event[];
  @Input() theme = 'def';
  @Input() active: number;

  constructor(private backend: BackendService, private events: EventListService) {}

  ngOnInit(): void {
    this.events.get().subscribe(ev => {
      this.editions = ev;
      console.log(ev);
    });
  }


}
