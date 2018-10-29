import {Component, Input, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {Event} from '../../../types/event';

@Component({
  selector: 'app-select-event',
  templateUrl: './select-event.component.html',
  styles: [
      `
      [role="main"] {
        padding-top: 48px; /* Space for fixed navbar */
      }
    `]
})
export class SelectEventComponent implements OnInit {
  editions: Event[];

  constructor(private backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.getEditions().subscribe(ev => this.editions = ev);
  }
}
