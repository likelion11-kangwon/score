import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TeamModule } from '../team/team.module.js';

@Module({
  imports: [PrismaModule, TeamModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
