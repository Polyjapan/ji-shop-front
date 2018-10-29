import {Component, Input} from '@angular/core';
import {PartialIntranetTask, TaskPriority, TaskPriorityUtils} from '../../../types/intranet';

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
