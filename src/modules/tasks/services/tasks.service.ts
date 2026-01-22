import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { createEvent } from 'src/common/queues/events/event-factory';

import { TASKS_QUEUE } from '../queues/tasks-queue.constants';
import { TasksEventsEnum } from '../queues/events/enums';

import { TaskRecorder } from './task-recorder';
import { DeferredJob } from './interfaces';

@Injectable()
export class TasksService {
  constructor(@Inject(TASKS_QUEUE.clientToken) private client: ClientProxy) {}

  public async runLater(
    callback: (runner: any, context: Record<string, any>) => void | Promise<void>,
    context: Record<string, any> = {},
  ): Promise<DeferredJob[]> {
    const recorder = new TaskRecorder(context);

    /**
     * Execute the input callback, passing the Proxy runner
     */
    await callback(recorder.runner, context);

    /**
     * Get clean list of tasks, which need to execute later
     */
    const jobs = recorder.getRecordedJobs();

    if (jobs.length > 0) {
      const event = createEvent<DeferredJob[]>(TasksEventsEnum.EXECUTE, jobs);
      this.client.emit(event.type, event);
    }
    return jobs;
  }
}
