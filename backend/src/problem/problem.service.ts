import { Injectable } from '@nestjs/common';
import { Problem, Team, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserException } from '../errors/user-error.js';

export type Problems = Record<
  string,
  {
    score: number;
    description?: string;
    previousId?: string;
    isLeaderAssigned?: true;
    isNonLeaderAssigned?: true;
    requiredSolvedUserCount: number;
  }
>;

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async getProblem(id: string): Promise<Problem> {
    const problem = await this.prisma.problem.findFirst({
      where: { id },
    });
    if (problem === null) throw new UserException(`문제(${id})가 없습니다.`);
    return problem;
  }

  async getProblems(ids?: string[]): Promise<Problem[]> {
    return this.prisma.problem.findMany({
      where: { id: ids ? { in: ids } : undefined },
    });
  }

  async sync(problems: Problems): Promise<void> {
    await this.prisma.$transaction(
      Object.entries(problems).map(([id, attributes]) =>
        this.prisma.problem.upsert({
          where: { id },
          create: { id, ...attributes },
          update: { ...attributes },
        }),
      ),
    );
  }

  isValidUserForProblem(problem: Problem, user: User): boolean {
    return (
      (problem.isLeaderAssigned && user.isLeader) ||
      (problem.isNonLeaderAssigned && !user.isLeader) ||
      (!problem.isLeaderAssigned && !problem.isNonLeaderAssigned)
    );
  }

  async isSolvedByUser(problem: Problem, user: User): Promise<boolean> {
    return this.prisma.user
      .count({
        where: {
          id: user.id,
          solvedProblems: { some: { id: problem.id } },
        },
      })
      .then((count) => count > 0);
  }

  async markAsSolved(problem: Problem, user: User): Promise<void> {
    // 해당 사용자가 도전자가 아니라면 종료
    if (!this.isValidUserForProblem(problem, user)) return;

    this.prisma.$transaction(async (prisma) => {
      // 사용자가 해결한 것으로 표시
      await prisma.user.update({
        data: { solvedProblems: { connect: { id: problem.id } } },
        where: { id: user.id },
      });

      await prisma.solvingLog.create({
        data: { problemId: problem.id, userId: user.id, timestamp: new Date() },
      });

      // 팀이 있는 경우 팀의 달성 여부를 업데이트한다
      if (user.teamId !== null) {
        let isLeader: boolean | undefined = undefined;

        if (problem.isLeaderAssigned) {
          isLeader = true;
        }

        if (problem.isNonLeaderAssigned) {
          isLeader = false;
        }

        const solvedUserCountInTeam = await prisma.user.count({
          where: {
            teamId: user.teamId,
            isLeader,
            solvedProblems: { some: { id: problem.id } },
          },
        });

        // 일정 인원 이상이 도전을 해결했다면
        if (solvedUserCountInTeam >= problem.requiredSolvedUserCount) {
          // 팀이 해결한 것으로 표시
          await prisma.team.update({
            data: { solvedProblems: { connect: { id: problem.id } } },
            where: { id: user.teamId },
          });
        }
      }
    });
  }

  async getSolvedUsers(problem: Problem, team?: Team): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        solvedProblems: { some: { id: problem.id } },
        teamId: team?.id,
      },
    });

    return users;
  }

  async getSolvedTeams(problem: Problem): Promise<Team[]> {
    const teams = await this.prisma.user.findMany({
      where: {
        solvedProblems: { some: { id: problem.id } },
      },
    });

    return teams;
  }
}
