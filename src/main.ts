import 'module-alias/register';

import '@root/string.extensions';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@common/pipes';
import { LoggerService } from '@src/logger';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function start() {
  const PORT = process.env.PORT || 5000;
  const CLIENT_URL = process.env.CLIENT_URL || undefined;

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  setupLogger(app);
  setupDocsModule(app);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.setGlobalPrefix('api/1.0');

  const whitelist = [CLIENT_URL];
  setupCORS(app, whitelist);

  setupSession(app);

  // eslint-disable-next-line no-console
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

function setupDocsModule(app: INestApplication) {
  const docConfig = new DocumentBuilder()
    .setTitle('SOWA-Server')
    .setDescription('This is an API for messengers SOWA')
    .setVersion('1.0.0')
    .addTag('SOWA JS')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('/api/docs', app, document);
}

function setupCORS(app: INestApplication, whiteList: string[]) {
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
    maxAge: 600,
  });
}

function setupLogger(app: INestApplication) {
  app.useLogger(app.get(LoggerService));
}

function setupSession(app: INestApplication) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY || 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
}

start();
