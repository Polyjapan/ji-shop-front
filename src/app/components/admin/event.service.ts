import {Event} from '../../types/event';
import {Observable, Subject} from 'rxjs/Rx';
import {BackendService} from '../../services/backend.service';
import {Injectable} from '@angular/core';

@Injectable()
export class EventService {
  observable: Subject<Event>;
  current: number;

  constructor(private backend: BackendService) {
    this.observable = new Subject<Event>();
  }

  public invalidate() {
    this.query();
  }

  public clear() {
    this.current = undefined;
  }

  private query() {
    this.backend.getEvent(this.current).subscribe(ev => this.observable.next(ev));
  }

  public get(id: number): Observable<Event> {
    if (this.current !== id) {
      this.current = id;
      this.query();
    }

    return this.observable.asObservable();
  }

}
