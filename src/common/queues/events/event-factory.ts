import { BaseEvent } from '../types/base-event.interface';

export const createEvent = <T = any>(eventType: string, payload: T): BaseEvent<T> => {
  return {
    type: eventType,
    payload,

    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
};
