import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HolidaysModule } from './holidays/holidays.module';

async function bootstrap() {
  const app = await NestFactory.create(HolidaysModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
