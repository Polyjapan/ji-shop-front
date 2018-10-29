import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import {Item, ItemList, ItemsResponse} from '../../types/items';
import {CheckedOutItem, FullOrder, FullOrderData, Order, Source} from '../../types/order';
import {LoginResponse} from '../../services/auth.service';
import {ApiResult} from '../../types/api_result';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ScanResult} from '../../types/scan_result';
import {ScanConfiguration, ScanConfigurationWithItems} from '../../types/scan_configuration';
import {Event} from '../../types/event';
import {PosConfiguration, PosGetConfigResponse, PosOrderResponse, PosPaymentLog} from '../../types/pos_configuration';
import {StatsReturn} from '../../types/stats';
import {Client, ClientAndPermissions} from '../../types/client';
import {Permissions} from '../../constants/permissions';
import {PartialIntranetTask, TaskPriority, TaskState, TaskStateUtils} from '../../types/intranet';
import {IntranetService} from './intranet.service';
import {Subject} from 'rxjs/Rx';


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
    return this.backend.getTasks(this.event).map(tasks => {
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
    });
  }

  private checkId(event: number) {
    if (this.event !== event) {
      this.event = event;
      this.invalidate();
    }
  }

  /*getTasks(event: number) {
    this.checkId(event);

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

    return Observable.of(this.taskMap);
  }
}

