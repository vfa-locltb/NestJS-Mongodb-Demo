import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'https://localhost:3000',
    credentials: true,
  })
  await app.listen(3000);
}
bootstrap();
