import {Component, Input} from '@angular/core';
import {PartialIntranetTask, TaskPriority, TaskPriorityUtils, TaskUtils} from '../../../types/intranet';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html'
})
export class TasklistComponent {
  @Input() title: string;
  @Input() tasks: PartialIntranetTask[];

  getTime(time: number) {
    return TaskUtils.getTime(time);
  }

  priorityClass(prio: TaskPriority) {
    return 'badge badge-' + TaskPriorityUtils.priorityClass(prio);
  }

  priorityString(prio: TaskPriority) {
    return TaskPriorityUtils.priorityString(prio);
  }
}
