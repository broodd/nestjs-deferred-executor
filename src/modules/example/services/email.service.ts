import { Injectable, Logger } from '@nestjs/common';

import { delay } from 'src/common/helpers';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  public async send(email: string) {
    await delay();
    this.logger.log('Email sent to:', email);
  }

  /**
   * Example nested chain method
   */
  public to(email: string) {
    return {
      template: (name: string) => ({
        send: async (payload?: any) => {
          await delay();
          this.logger.log(`Email sent to ${email}`, { template: name, payload });
        },
      }),
    };
  }
}
