import { Controller, Post } from '@nestjs/common';

import { TasksService } from './modules/tasks/services';

@Controller('tasks')
export class AppController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('example')
  public async example() {
    return await this.tasksService.runLater((runner) => {
      runner.UserRepository.manager.repository.update(1, { name: 'New name' });
      runner.UserRepository.update(1, { name: 'New name' });
      runner.EmailService.send('test@example.com');
      runner.EmailService.to('test@example.com').template('welcome').send({ name: 'New name' });
    });
  }
}
