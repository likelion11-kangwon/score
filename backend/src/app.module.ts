import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module.js';
import { ProblemModule } from './problem/problem.module.js';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    UserModule,
    ProblemModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
