import {
  ClientsProviderAsyncOptions,
  ClientProviderOptions,
  ClientsModule,
} from '@nestjs/microservices';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DynamicModule, Provider, Module } from '@nestjs/common';

import { TASKS_MODULE_OPTIONS, TASKS_MODULE } from './tasks.constants';
import { TasksOptionsFactory } from './interfaces';
import { TasksService } from './services';

@Module({})
export class TasksModule {
  static register(options: ClientProviderOptions): DynamicModule {
    return {
      module: TasksModule,
      imports: [ClientsModule.register([options])],
      providers: [
        { provide: TASKS_MODULE_OPTIONS, useValue: options },
        { provide: TASKS_MODULE, useValue: randomStringGenerator() },
        { provide: TasksService, useClass: TasksService },
      ],
      exports: [TASKS_MODULE, TASKS_MODULE_OPTIONS, TasksService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  public static registerAsync(options: ClientsProviderAsyncOptions): DynamicModule {
    return {
      module: TasksModule,
      imports: (options.imports || []).concat([ClientsModule.registerAsync([options])]),
      providers: [
        ...this.createAsyncProviders(options),
        { provide: TASKS_MODULE, useValue: randomStringGenerator() },
        { provide: TasksService, useClass: TasksService },
      ],
      exports: [TASKS_MODULE, TASKS_MODULE_OPTIONS, TasksService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncProviders(options: ClientsProviderAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncOptionsProvider(options: ClientsProviderAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: TASKS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: TASKS_MODULE_OPTIONS,
      useFactory: (optionsFactory: TasksOptionsFactory) => optionsFactory.createTasksOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
