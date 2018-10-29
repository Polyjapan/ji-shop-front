import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PartialIntranetTask, TaskState, TaskStateUtils} from '../../../types/intranet';
import {TasksService} from '../tasks.service';

@Component({
  selector: 'app-tasklists',
  template: `
    <div class="row" *ngIf="taskMap">
      <div class="col-md-4" *ngFor="let state of acceptedStates">
        <app-tasklist [title]="colName(state)" [tasks]="taskMap.get(state)"></app-tasklist>
      </div>
    </div>
  `
})
export class TasklistsComponent implements OnInit {
  acceptedStates: TaskState[];
  taskMap: Map<TaskState, PartialIntranetTask[]>;

  constructor(private tasks: TasksService, private route: ActivatedRoute) {
  }

  colName(state: TaskState) {
    return TaskStateUtils.stateString(state);
  }

  ngOnInit(): void {
    const r = this.route.snapshot;
    this.acceptedStates = r.data.acceptedStates;
    const event = r.parent.paramMap.get('event');

    this.tasks.getTasksMap(Number(event)).subscribe(tasks => {
      this.taskMap = tasks;
    });
  }

}
