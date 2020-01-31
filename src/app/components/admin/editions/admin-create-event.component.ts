import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';
import {Event} from '../../../types/event';
import {EventService} from '../event.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-admin-create-event',
  templateUrl: 'admin-create-event.component.html'
})
export class AdminCreateEventComponent implements OnInit {
  event: Event;
  sending = false;
  loading = false;
  isNew = true;
  cloneId: number;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute, private eventService: EventService) {
  }

  submit() {
    let obs: Observable<number>;

    if (!this.cloneId) {
      obs = this.backend.createOrUpdateEvent(this.event);
    } else {
      obs = this.backend.cloneEvent(this.cloneId, this.event);
    }

    obs.subscribe(
      res => {
        this.eventService.invalidate();
        this.router.navigate(['admin', 'events', res]);
      },
      err => {
        const errors = Errors.replaceErrorsInResponse(err, undefined, new Map<string, string>([
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

    if (this.route.snapshot.paramMap.has('cloneId')) {
      this.cloneId = Number(this.route.snapshot.paramMap.get('cloneId'));

      // Still load the events
      this.loading = true;
      this.backend.getEvent(this.cloneId).subscribe(ev => {
        this.event = ev;
        this.loading = false;
      });
    }

    this.event = new Event();
  }

}
