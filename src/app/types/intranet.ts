import {Client} from './client';

export enum TaskState {
  Sent = 'SENT',
  Refused = 'REFUSED',
  Waiting = 'WAITING',
  InProgress = 'INPROGRESS',
  Done = 'DONE',
  Dropped = 'DROPPED'
}


export class TaskStateUtils {
  static allStates() {
    return [TaskState.Sent,
      TaskState.Refused,
      TaskState.Waiting,
      TaskState.InProgress,
      TaskState.Done,
      TaskState.Dropped];
  }

  static stateClass(state: TaskState) {
    switch (state) {
      case TaskState.Sent:
        return 'primary';
      case TaskState.Refused:
        return 'secondary';
      case TaskState.Waiting:
        return 'warning';
      case TaskState.InProgress:
        return 'info';
      case TaskState.Done:
        return 'success';
      case TaskState.Dropped:
        return 'secondary';
    }
  }

  static stateString(state: TaskState) {
    switch (state) {
      case TaskState.Sent:
        return 'Envoyé';
      case TaskState.Refused:
        return 'Refusé';
      case TaskState.Waiting:
        return 'En attente';
      case TaskState.InProgress:
        return 'En cours';
      case TaskState.Done:
        return 'Terminé';
      case TaskState.Dropped:
        return 'Abandonné';
    }
  }
}


export enum TaskPriority {
  Critical = 1,
  VeryUrgent = 2,
  Urgent = 3,
  Normal = 4,
  Low = 5
}

export class TaskPriorityUtils {
  static priorityClass(prio: TaskPriority) {
    switch (prio) {
      case TaskPriority.Critical:
        return 'danger';
      case TaskPriority.VeryUrgent:
        return 'warning';
      case TaskPriority.Urgent:
        return 'warning';
      case TaskPriority.Normal:
        return 'info';
      case TaskPriority.Low:
        return 'secondary';
    }
  }

  static priorityString(prio: TaskPriority) {
    switch (prio) {
      case TaskPriority.Critical:
        return 'Critique';
      case TaskPriority.VeryUrgent:
        return 'Très urgent';
      case TaskPriority.Urgent:
        return 'Urgent';
      case TaskPriority.Normal:
        return 'Normal';
      case TaskPriority.Low:
        return 'Faible';
    }
  }
}

export class PartialIntranetTask {
  id: number;
  name: string;
  priority: number;
  state: TaskState;
  createdBy: Client;
  createdAt: number;
  tags: string[];
}

export class CompleteTaskLog {
  targetState: TaskState;
  createdBy: Client;
  createdAt: number;
}

export class CompleteTaskAssignationLog {
  assignee: Client;
  deleted: boolean;
  createdBy: Client;
  createdAt: number;
}

export class CompleteTaskComment {
  content: string;
  createdBy: Client;
  createdAt: number;
}

export class CompleteIntranetTask {
  id: number;
  name: string;
  priority: number;
  state: TaskState;
  createdBy: Client;
  createdAt: number;
  comments: CompleteTaskComment[];
  logs: CompleteTaskLog[];
  assignationLogs: CompleteTaskAssignationLog[];
  assignees: Client[];
  tags: string[];
}

