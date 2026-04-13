import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global ValidationPipe – transforms and validates every incoming request body
  // whitelist: strips properties not defined in the DTO
  // forbidNonWhitelisted: throws an error if unknown properties are sent
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(3000);
  console.log('Workshop API running on http://localhost:3000');
}
bootstrap();
