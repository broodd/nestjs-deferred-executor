import { ClientsProviderAsyncOptions } from '@nestjs/microservices';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

/**
 * [description]
 */
export interface TasksOptionsFactory {
  /**
   * [description]
   */
  createTasksOptions(): Promise<ClientsProviderAsyncOptions> | ClientsProviderAsyncOptions;
}

/**
 * [description]
 */
export interface TasksModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * [description]
   */
  useExisting?: Type<TasksOptionsFactory>;

  /**
   * [description]
   */
  useClass?: Type<TasksOptionsFactory>;

  /**
   * [description]
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<ClientsProviderAsyncOptions> | ClientsProviderAsyncOptions;

  /**
   * [description]
   */
  inject?: any[];
}
