export interface BaseEvent<T = any> {
  type: string;
  payload: T;

  metadata: {
    timestamp: string;
  };
}
