export interface DeferredJob {
  providerToken: string;
  steps: JobStep[];
  context: Record<string, any>;
}

export interface JobStep {
  methodPath: string;
  args: any[];
}
