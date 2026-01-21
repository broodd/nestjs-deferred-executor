import { randomUUID } from 'crypto';

import compress from '@fastify/compress';
import helmet from '@fastify/helmet';

import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from './common/filters';
import { validationPipe } from './common/pipes';

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

  if (configService.getMode(ConfigMode.production)) app.enableShutdownHooks();

  await swaggerSetup(app, configService);

  return app.listen(configService.get('PORT'), configService.get('HOST'));
}
bootstrap();
