import 'dotenv/config.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
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

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ limit: '500mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
