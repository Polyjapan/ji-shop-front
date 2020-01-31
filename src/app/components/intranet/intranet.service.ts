import {Injectable} from '@angular/core';


import {environment} from '../../../environments/environment';
import {ApiResult} from '../../types/api_result';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Client} from '../../types/client';
import {Permissions} from '../../constants/permissions';
import {CompleteIntranetTask, PartialIntranetTask, TaskPriority, TaskState} from '../../types/intranet';


@Injectable()
export class IntranetService {
  private _baseApiUrl = environment.apiurl;
  private _intraUrl = this._baseApiUrl + '/intranet/tasks';
  private _usersUrl = this._baseApiUrl + '/admin/users/withPerm';

  constructor(private http: HttpClient) {
  }

  createTaskHelper(event: number, name: string, description: string, priority: TaskPriority, tags: string): Observable<number> {
    return this.createTask(event, {
      name: name, initialComment: description, tags: tags, priority: priority.valueOf()
    });
  }

  createTask(event: number, task): Observable<number> {
    return this.http.post<number>(this._intraUrl + '/byEvent/' + event, task);
  }

  getTasks(event: number): Observable<PartialIntranetTask[]> {
    return this.http.get<PartialIntranetTask[]>(this._intraUrl + '/byEvent/' + event);
  }

  getTask(task: number): Observable<CompleteIntranetTask> {
    return this.http.get<CompleteIntranetTask>(this._intraUrl + '/byId/' + task);
  }

  updatePriority(task: number, priority: TaskPriority): Observable<ApiResult> {
    return this.http.put<ApiResult>(this._intraUrl + '/byId/' + task + '/priority', {
     priority: priority.valueOf()
    });
  }

  updateState(task: number, state: TaskState): Observable<ApiResult> {
    return this.http.put<ApiResult>(this._intraUrl + '/byId/' + task + '/state', {
     state: state.valueOf()
    });
  }

  addComment(task: number, content: string): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._intraUrl + '/byId/' + task + '/comments', content);
  }

  addTags(task: number, tags: string[]): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._intraUrl + '/byId/' + task + '/tags/add', tags.join(';'));
  }

  removeTags(task: number, tags: string[]): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._intraUrl + '/byId/' + task + '/tags/remove', tags.join(';'));
  }

  addAssignee(task: number, assignee: Client): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._intraUrl + '/byId/' + task + '/assignees/add', {assignee: assignee.id});
  }

  removeAssignee(task: number, assignee: Client): Observable<ApiResult> {
    return this.http.post<ApiResult>(this._intraUrl + '/byId/' + task + '/assignees/remove', {assignee: assignee.id});
  }

  getUsers(): Observable<Client[]> {
    return this.http.get<Client[]>(this._usersUrl + '/' + Permissions.INTRANET_VIEW);
  }
}

