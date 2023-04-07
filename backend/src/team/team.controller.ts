import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TeamService } from './team.service.js';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeams() {
    const teams = await this.teamService.getTeams();
    return { teams };
  }

  @Get(':id')
  async getTeam(@Param('id', ParseIntPipe) teamId: number) {
    const team = await this.teamService.getTeam(teamId);
    return {
      team: {
        id: team.id,
        name: team.name,
        score: team.score,
        users: team.users.map((user) => ({
          id: user.id,
          name: user.name,
          isLeader: user.isLeader,
        })),
      },
    };
  }

  @Get(':id/solved-problems')
  async getTeamSolvedProblems(@Param('id', ParseIntPipe) teamId: number) {
    const team = await this.teamService.getTeam(teamId);
    const problems = await this.teamService.getSolvedProblems(team);

    return {
      problems: problems.map((problem) => ({
        id: problem.id,
        score: problem.score,
      })),
    };
  }
}
