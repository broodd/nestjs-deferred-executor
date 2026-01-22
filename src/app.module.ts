import { Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

import { DEFAULT_RMQ_QUEUE_CONFIG } from './common/queues/constants';

import { TASKS_QUEUE } from './modules/tasks/queues/tasks-queue.constants';
import { ExampleModule } from './modules/example/example.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigService, ConfigModule } from './config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    ExampleModule,

    TasksModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: TASKS_QUEUE.clientToken,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queue: TASKS_QUEUE.name,
          queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
