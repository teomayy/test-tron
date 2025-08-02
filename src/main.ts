import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.printf(({ level, message, timestamp }) => {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              return `[${timestamp}] ${level}: ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    }),
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
