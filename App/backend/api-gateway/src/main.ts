import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as  cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
