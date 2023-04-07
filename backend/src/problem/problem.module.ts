import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller.js';
import { ProblemService } from './problem.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProblemValidator } from './problem-validator.js';
import { UserModule } from '../user/user.module.js';
import { TeamModule } from '../team/team.module.js';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [PrismaModule, UserModule, TeamModule, NestjsFormDataModule],
  controllers: [ProblemController],
  providers: [ProblemService, ProblemValidator],
})
export class ProblemModule {}
