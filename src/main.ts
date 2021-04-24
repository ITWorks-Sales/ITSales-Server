import 'dotenv/config.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 60 seconds
      max: 500, // limit each IP to 50 requests per windowMs
    }),
  );

  await app.listen(3000);
}
bootstrap();
