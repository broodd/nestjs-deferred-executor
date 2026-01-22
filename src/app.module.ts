import { Module } from '@nestjs/common';

import { ExampleModule } from './modules/example/example.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from './config';

@Module({
  imports: [ConfigModule, TasksModule, ExampleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
