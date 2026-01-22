import { Injectable, Logger } from '@nestjs/common';

import { delay } from 'src/common/helpers';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  /**
   * Example nested property
   */
  public readonly manager = {
    repository: {
      update: (id, data) => this.logger.log('User updated:', id, data),
    },
  };

  async update(id: number, data: any) {
    await delay();
    this.logger.log('User updated:', id, data);
  }
}
