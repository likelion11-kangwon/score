import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Problem, Team, User } from '@prisma/client';
import { UserException } from '../errors/user-error.js';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeam(id: number): Promise<
    Team & {
      score: number;
      users: User[];
    }
  > {
    const team = await this.prisma.team.findFirst({
      select: {
        id: true,
        name: true,
        destroyedAt: true,
        solvedProblems: {
          select: {
            score: true,
          },
        },
        users: true,
      },
      where: { id },
    });

    if (team === null) {
      throw new UserException('팀이 없습니다.');
    }

    return {
      ...team,
      score: team.solvedProblems.reduce((prev, curr) => prev + curr.score, 0),
      users: team.users,
    };
  }

  async getTeams(): Promise<
    (Team & {
      score: number;
      users: User[];
    })[]
  > {
    const teams = await this.prisma.team.findMany({
      select: {
        id: true,
        name: true,
        destroyedAt: true,
        solvedProblems: {
          select: {
            score: true,
          },
        },
        users: true,
      },
    });

    return teams.map((team) => ({
      ...team,
      score: team.solvedProblems.reduce((prev, curr) => prev + curr.score, 0),
      users: team.users,
    }));
  }

  async getSolvedProblems(team: Team): Promise<Problem[]> {
    const problems = await this.prisma.problem.findMany({
      where: {
        solvedTeams: {
          some: {
            id: team.id,
          },
        },
      },
    });

    return problems;
  }
}
