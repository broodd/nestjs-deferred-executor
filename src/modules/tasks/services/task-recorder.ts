import { DeferredJob } from './interfaces';

export class TaskRecorder {
  private jobs: DeferredJob[] = [];

  constructor(private context: Record<string, any> = {}) {}

  /**
   * Returns a Proxy object that “listens” for method calls
   */
  public get runner(): any {
    return new Proxy(
      {},
      {
        get: (_, providerToken: string) => {
          const job: DeferredJob = {
            providerToken,
            steps: [],
            context: this.context,
          };
          this.jobs.push(job);

          return this.createChainRecorder(job, []);
        },
      },
    );
  }

  /**
   * Returns a list of recorded tasks
   */
  public getRecordedJobs(): DeferredJob[] {
    return this.jobs;
  }

  /**
   * Recursive method for recording a chain of calls (chaining)
   */
  private createChainRecorder(job: DeferredJob, pathParts: string[]): any {
    return new Proxy(() => {}, {
      /**
       * Trap for accessing properties (path accumulation)
       */
      get: (_, prop) => {
        if (typeof prop === 'symbol') return undefined;
        return this.createChainRecorder(job, [...pathParts, prop.toString()]);
      },

      /**
       * Trap for calling a function (steps accumulation)
       */
      apply: (_, __, args) => {
        job.steps.push({
          methodPath: pathParts.join('.'),
          args,
        });

        /**
         * Discard the path, but return the proxy for the next step (chaining)
         * This allows you to do runner.Service.method1().method2()
         */
        return this.createChainRecorder(job, []);
      },
    });
  }
}
