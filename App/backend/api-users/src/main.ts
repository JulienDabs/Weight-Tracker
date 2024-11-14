import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
=======
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as dotenv from 'dotenv';

// dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const logger = new Logger('Bootstrap');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Creating users and manage their informations')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
>>>>>>> mailing-service
}
bootstrap();
