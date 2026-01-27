import { randomUUID } from 'crypto';

import compress from '@fastify/compress';
import helmet from '@fastify/helmet';

import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { DEFAULT_RMQ_QUEUE_CONFIG } from './common/queues/constants';
import { HttpExceptionFilter } from './common/filters';
import { validationPipe } from './common/pipes';

import { TASKS_QUEUE } from './modules/tasks/queues/tasks-queue.constants';
import { ConfigAppMode, ConfigMode } from './config/interfaces';
import { AppModule } from './app.module';
import { ConfigService } from './config';
import { swaggerSetup } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (raw) => {
        return (raw.headers['x-request-id'] as string) || randomUUID();
      },
    }),
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());

  if (configService.getMode(ConfigMode.production)) {
    app.enableShutdownHooks();
  }

  const appMode = configService.get<ConfigAppMode>('APP_MODE');

  if (appMode === ConfigAppMode.API || appMode === ConfigAppMode.ALL) {
    await app.register(compress, { encodings: ['gzip', 'deflate'] });
    await app.register(helmet, { contentSecurityPolicy: false });

    app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
      credentials: configService.get('CORS_CREDENTIALS'),
      origin: configService.get('CORS_ORIGIN'),
    });

    await swaggerSetup(app, configService);

    await app.listen(configService.get('PORT'), configService.get('HOST'));
  }

  if (appMode === ConfigAppMode.WORKER || appMode === ConfigAppMode.ALL) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')],
        queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
        queue: TASKS_QUEUE.name,
      },
    });

    await app.startAllMicroservices();
  }
}
bootstrap();
