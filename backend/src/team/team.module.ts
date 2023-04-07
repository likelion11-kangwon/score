import { Module } from '@nestjs/common';
import { TeamController } from './team.controller.js';
import { TeamService } from './team.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
