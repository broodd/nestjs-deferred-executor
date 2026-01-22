import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

import { DEFAULT_RMQ_QUEUE_CONFIG } from 'src/common/queues/constants';

import { ConfigService } from 'src/config';

import { TASKS_QUEUE } from './queues/tasks-queue.constants';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TASKS_QUEUE.clientToken,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: TASKS_QUEUE.name,
            queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
