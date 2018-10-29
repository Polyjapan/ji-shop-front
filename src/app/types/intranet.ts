import {Client} from './client';
import {Event} from './event';

export enum TaskState {
  Sent = 'SENT',
  Refused = 'REFUSED',
  Waiting = 'WAITING',
  InProgress = 'INPROGRESS',
  Done = 'DONE',
  Dropped = 'DROPPED'
}

export enum TaskPriority {
  Critical = 1,
  VeryUrgent = 2,
  Urgent = 3,
  Normal = 4,
  Low = 5
}

export class PartialIntranetTask {
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

