import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {SalesData, StatsReturn} from '../../types/stats';
import {Source} from '../../types/order';
import * as Errors from '../../constants/errors';
import {ErrorCodes} from '../../constants/errors';
import {Event} from '../../types/event';
import {EventService} from './event.service';

@Component({
  selector: 'app-admin-create-event',
  templateUrl: 'admin-create-event.component.html'
})
export class AdminCreateEventComponent implements OnInit {
  event: Event;
  sending = false;
  loading = false;
  isNew = true;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private eventService: EventService) {}

  submit() {
    this.backend.createOrUpdateEvent(this.event).subscribe(
      res => {
        this.eventService.invalidate();
        this.router.navigate(['admin', res]);
      },
      err => {
        const errors = Errors.replaceErrors(err.error.errors, undefined, new Map<string, string>([
          ['name', 'Nom'],
          ['location', 'Emplacement'],
        ]));

        alert('Des erreurs se sont produites durant l\'envoi : ' + errors.join('; '));
        this.sending = false;
      }
    );

    this.sending = true;
  }

  ngOnInit(): void {
    if (this.route.parent) {
      this.route.parent.paramMap.subscribe(map => {
        if (map.has('event')) {
          const eventId = map.get('event');
          this.loading = true;

          this.backend.getEvent(Number(eventId)).subscribe(ev => {
            this.event = ev;
            this.isNew = false;
            this.loading = false;
          });
        }
      });
    }

    this.event = new Event();
  }
}
