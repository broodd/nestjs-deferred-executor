import { Module } from '@nestjs/common';

import { UserRepository } from './repositories';
import { TasksConsumer } from './controllers';
import { EmailService } from './services';

@Module({
  imports: [],
  controllers: [TasksConsumer],
  providers: [
    /**
     * For correctly working to get provider by string token,
     * need to define provider with a token
     */
    { provide: 'UserRepository', useClass: UserRepository },
    { provide: 'EmailService', useClass: EmailService },
  ],
})
export class ExampleModule {}
