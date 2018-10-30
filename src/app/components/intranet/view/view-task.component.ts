import {Component, Input, OnInit} from '@angular/core';
import {
  CompleteIntranetTask, HistoryElement,
  PartialIntranetTask,
  TaskPriority,
  TaskPriorityUtils, TaskState,
  TaskStateUtils,
  TaskUtils
} from '../../../types/intranet';
import {IntranetService} from '../intranet.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styles: [
      `.ng-valid[required], .ng-valid.required {
      border-left: 3px solid #42A948; /* green */
    }

    .ng-invalid:not(form) {
      border: 1px solid #a94442; /* red */
    }
    `
  ]
})
export class ViewTaskComponent implements OnInit {
  task: CompleteIntranetTask;
  elements: HistoryElement[];

  TaskUtils = TaskUtils;
  TaskStateUtils = TaskStateUtils;
  TaskPriorityUtils = TaskPriorityUtils;

  constructor(private service: IntranetService, private route: ActivatedRoute, private router: Router) {
  }

  stateClass(state: TaskState) {
    return 'badge badge-' + TaskStateUtils.stateClass(state);
  }

  priorityClass(prio: TaskPriority) {
    return 'badge badge-' + TaskPriorityUtils.priorityClass(prio);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));

      this.service.getTask(id).subscribe(res => {
        console.log(res);

        this.elements = [].concat(res.comments).concat(res.assignationLogs).concat(res.logs);

        console.log(this.elements);

        this.elements.sort((a, b) => a.createdAt - b.createdAt); // TODO reverse order?

        this.task = res;
      });
    });
  }
}
