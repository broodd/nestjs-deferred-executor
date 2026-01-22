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
import { ConfigMode } from './config/interfaces';
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

  await app.register(compress, { encodings: ['gzip', 'deflate'] });
  await app.register(helmet, { contentSecurityPolicy: false });

  app.setGlobalPrefix(configService.get('PREFIX')).enableCors({
    credentials: configService.get('CORS_CREDENTIALS'),
    origin: configService.get('CORS_ORIGIN'),
  });

  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queueOptions: DEFAULT_RMQ_QUEUE_CONFIG,
      queue: TASKS_QUEUE.name,
      noAck: true,
    },
  });

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();

  await swaggerSetup(app, configService);

  await app.startAllMicroservices();
  return app.listen(configService.get('PORT'), configService.get('HOST'));
}
bootstrap();
