import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LokiLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const logger = new LokiLoggerService();
  logger.log('🟢 Starting Tron Service...');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    // logger,
  });

  app.useLogger(logger);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
  console.log('App started');
}
void bootstrap();
