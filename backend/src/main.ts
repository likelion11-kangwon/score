import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ProblemService } from './problem/problem.service.js';
import { PROBLEMS } from './problems.js';
import { HttpExceptionFilter } from './http-exception-filter.js';
import { ResponseInterceptor } from './response-interceptor.js';
import { ValidationPipe } from '@nestjs/common';

const app = await NestFactory.create(AppModule);
app.enableCors();
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new ResponseInterceptor());

await app.get(ProblemService).sync(PROBLEMS);

await app.listen(3000);
