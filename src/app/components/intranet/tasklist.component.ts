import {Component, Input, OnInit} from '@angular/core';
import {NavigationComponent} from '../../abstraction/navigation-component';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from '../admin/admin.component';
import {PartialIntranetTask, TaskPriority, TaskPriorityUtils, TaskState} from '../../types/intranet';
import {TasksService} from './tasks.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html'
})
export class TasklistComponent {
  @Input() title: string;
  @Input() tasks: PartialIntranetTask[];

  getTime(time: number) {
    const date = new Date(time);
    return date.getDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getFullYear() + ' à ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  priorityClass(prio: TaskPriority) {
    return 'badge badge-' + TaskPriorityUtils.priorityClass(prio);
  }

  priorityString(prio: TaskPriority) {
    return TaskPriorityUtils.priorityString(prio);
  }
}
