import {Event} from '../../types/event';
import {Observable, Subject} from 'rxjs/Rx';
import {BackendService} from '../../services/backend.service';
import {Injectable} from '@angular/core';
import {query} from '@angular/animations';

@Injectable()
export class EventListService {
  observable: Subject<Event[]>;
  valid = false;

  constructor(private backend: BackendService) {
    this.observable = new Subject<Event[]>();
  }

  public invalidate() {
    this.valid = false;
    this.query();
  }

  private query() {
    if (this.valid) {
      return;
    }

    this.backend.getEditions().subscribe(ev => {
      this.valid = true;
      this.observable.next(ev);
    });
  }

  get() {
    this.query();
    return this.observable.asObservable();
  }
}
