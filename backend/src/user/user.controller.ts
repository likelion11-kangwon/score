import { Controller } from '@nestjs/common';
import { TeamService } from '../team/team.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly teamService: TeamService) {}
}
