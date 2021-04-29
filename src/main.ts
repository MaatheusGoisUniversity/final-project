import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/http-exception.filter';

import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import { join } from 'path';
import * as helmet from 'helmet';

import * as session from 'express-session';
import flash = require('connect-flash');
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Documentation
  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The Final-App API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  //Limit 
  app.use(json({ limit: '50mb' }));
  // Validations
  app.useGlobalPipes(new ValidationPipe());
  // Cors
  app.enableCors();
  // Add filters
  app.useGlobalFilters(new AllExceptionsFilter())
  //VIEW - HBS
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Passaport Session
  app.use(session({
    secret: 'AKSJNDKJSANDJ@#$%^&UYHGFDE$@R%TYHu3y12g3i87gbjuasd87g1ouj2v9ey',
    cookie: {
      maxAge: 86400000 * 7 * 12, // 1 ano
    },
    resave: true,
    saveUninitialized: true
  }))

  app.use(flash());
  app.use(helmet());

  await app.listen(process.env.PORT || '3000');
}
bootstrap();
