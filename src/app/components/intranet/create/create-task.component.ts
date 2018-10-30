import {Component, Input, OnInit} from '@angular/core';
import {PartialIntranetTask, TaskPriority, TaskPriorityUtils} from '../../../types/intranet';
import {IntranetService} from '../intranet.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as Errors from '../../../constants/errors';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
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
export class CreateTaskComponent implements OnInit {
  priorities = TaskPriorityUtils.allPriorities();
  sending = false;
  event: number;

  constructor(private service: IntranetService, private route: ActivatedRoute, private router: Router) {
  }

  getText(prio: TaskPriority) {
    return prio.valueOf() + ' - ' + TaskPriorityUtils.priorityString(prio);
  }

  submit(form) {
    if (form.valid) {

      const val = form.value;
      val.priority = Number(val.priority);

      this.sending = true;
      this.service.createTask(this.event, val)
        .subscribe(succ => this.router.navigate(['intranet', this.event, 'task', succ]),
          err => {
            const errors = Errors.replaceErrors(err.error.errors);

            alert('Des erreurs se sont produites durant l\'envoi : ' + errors.join('; '));
            this.sending = false;
          });
    } else {
      console.log('invalid form');
    }
  }

  ngOnInit(): void {
    this.route.parent.paramMap.subscribe(map => this.event = Number(map.get('event')));
  }
}
