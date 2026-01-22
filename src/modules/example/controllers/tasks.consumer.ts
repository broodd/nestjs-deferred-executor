import { EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import type { BaseEvent } from 'src/common/queues/types/base-event.interface';

import { TasksEventsEnum } from '../../tasks/queues/events/enums/tasks-events.enum';
import { DeferredJob } from 'src/modules/tasks/services/interfaces';

@Controller()
export class TasksConsumer {
  private readonly logger = new Logger(TasksConsumer.name);

  constructor(private moduleRef: ModuleRef) {}

  @EventPattern(TasksEventsEnum.EXECUTE)
  async handleExecute(@Payload() data: BaseEvent<DeferredJob[]>) {
    for (const job of data.payload) {
      this.logger.log(`Processing job for ${job.providerToken}`);

      let currentContext: any = this.moduleRef.get(job.providerToken, { strict: false });
      if (!currentContext) throw new Error(`Provider ${job.providerToken} not found`);

      for (const step of job.steps) {
        let method = currentContext;
        let parent = currentContext; // 'this' context for the function call

        /**
         * Split the path to handle nested properties
         */
        const pathParts = step.methodPath.split('.');
        for (const part of pathParts) {
          parent = method;
          method = method?.[part];
        }

        if (typeof method !== 'function') {
          throw new Error(
            `Method ${step.methodPath} is not a function on the current context of ${job.providerToken}`,
          );
        }

        /**
         * Execute method using .apply() to preserve 'this' context (parent)
         */
        const result = await method.apply(parent, step.args);
        this.logger.log(`Executed ${step.methodPath}`);

        /**
         * If method returns object, save 'currentContext'
         * NEXT step in loop executes on this new object context
         *
         * If it returns void/null, we keep the existing context or the chain ends
         */
        if (result !== undefined && result !== null) {
          currentContext = result;
        }
      }
    }
  }
}
