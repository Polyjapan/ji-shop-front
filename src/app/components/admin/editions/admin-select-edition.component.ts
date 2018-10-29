import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';

@Component({
  selector: 'app-admin-select-edition',
  templateUrl: './admin-select-edition.component.html',
  styleUrls: ['./admin-select-edition.component.css']
})
export class AdminSelectEditionComponent implements OnInit {
  editions: Event[];
  @Input() theme = 'def';
  @Input() active: number;

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.getEditions().subscribe(ev => this.editions = ev);
  }


}
