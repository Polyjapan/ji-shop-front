
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';


import {Observable, Subject, of} from 'rxjs';
import {PartialIntranetTask, TaskState, TaskStateUtils} from '../../types/intranet';
import {IntranetService} from './intranet.service';


@Injectable()
export class TasksService {
  private event: number;
  private tasks: PartialIntranetTask[];
  private taskMap: Map<TaskState, PartialIntranetTask[]>;
  private observables: Subject<PartialIntranetTask[]>[] = [];
  private mapObservables: Subject<Map<TaskState, PartialIntranetTask[]>>[] = [];

  constructor(private backend: IntranetService) {
  }

  invalidate() {
    this.tasks = null;
    this.taskMap = null;

    for (const obs of this.observables) {
      obs.complete();
    }
    for (const obs of this.mapObservables) {
      obs.complete();
    }

    this.observables = [];
    this.mapObservables = [];

    this.query();
  }

  private query() {
    return this.backend.getTasks(this.event).pipe(map(tasks => {
      this.tasks = tasks;

      for (const obs of this.observables) {
        obs.next(tasks);
      }

      this.tasks.sort((a, b) => a.createdAt - b.createdAt);

      this.taskMap = new Map();
      for (const type of TaskStateUtils.allStates()) {
        this.taskMap.set(type, []);
      }

      for (const task of tasks) {
        this.taskMap.get(task.state).push(task);
      }

      for (const obs of this.mapObservables) {
        obs.next(this.taskMap);
      }

      return this.taskMap;
    }));
  }

  private checkId(event: number) {
    if (this.event !== event) {
      this.event = event;
      this.invalidate();
    }
  }

  /*getTasks(events: number) {
    this.checkId(events);

    const observable: Subject<PartialIntranetTask[]> = new Subject<PartialIntranetTask[]>();
    this.observables.push(observable);

    if (!this.tasks) {
      this.query();
    } else {
      observable.next(this.tasks);
    }

    return observable.asObservable();
  }*/

  getTasksMap(event: number) {
    this.checkId(event);

    if (!this.tasks) {
      return this.query();
    }

    return of(this.taskMap);
  }
}

