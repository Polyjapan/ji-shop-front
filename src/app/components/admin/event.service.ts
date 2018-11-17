import {Event} from '../../types/event';
import {Observable, Subject} from 'rxjs/Rx';
import {BackendService} from '../../services/backend.service';
import {Injectable} from '@angular/core';
import {EventListService} from './event-list.service';
import {BetterSubject} from '../../abstraction/BetterSubject';

@Injectable()
export class EventService {
  observable: BetterSubject<Event>;
  event: Event;
  current: number;

  constructor(private backend: BackendService, private eventListService: EventListService) {
    this.observable = new BetterSubject<Event>();
  }

  public invalidate() {
    this.eventListService.invalidate();
    this.query();
  }

  public clear() {
    this.current = undefined;
  }

  private query() {
    this.backend.getEvent(this.current).subscribe(ev => {
      this.observable.next(ev);
      this.event = ev;
    });
  }

  public get(id: number): Observable<Event> {
    if (this.current !== id) {
      this.current = id;
      this.query();
    }

    return this.observable.asObservable();
  }

  getNow(id: number) {
    if (this.current === id) {
      return this.event;
    } else {
      return null;
    }
  }
}
