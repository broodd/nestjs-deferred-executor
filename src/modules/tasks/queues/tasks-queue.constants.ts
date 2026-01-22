import { RMQ_QueueConfigType } from 'src/common/queues/types';

export const TASKS_QUEUE = {
  name: 'tasks_queue',
  clientToken: 'RMQ_TASKS_SERVICE',
} as const satisfies RMQ_QueueConfigType;
