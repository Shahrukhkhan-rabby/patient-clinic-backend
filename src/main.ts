import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow frontend access
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'https://patient-clinic-bridge-git-main-md-shahrukh-khans-projects.vercel.app',
    ],
    credentials: true,
  });
  

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
