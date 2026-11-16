import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Enable global validation so DTO decorators take effect
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away any properties not defined in the DTO
    forbidNonWhitelisted: true, // Throws an error if extra properties are sent
    transform: true, // Automatically transforms payloads to DTO class instances
  }));
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
