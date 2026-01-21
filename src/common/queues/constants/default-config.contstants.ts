import { AmqplibQueueOptions } from '@nestjs/microservices/external/rmq-url.interface';

/**
 * Default config for RMQ Queue
 */
export const DEFAULT_RMQ_QUEUE_CONFIG: AmqplibQueueOptions = {
  durable: true,
};
