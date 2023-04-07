import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProblemValidator } from './problem-validator.js';
import { ProblemService } from './problem.service.js';
import { UserService } from '../user/user.service.js';
import { GetSolvedUsersQueryDto } from './dtos/get-solved-users-query.dto.js';
import { TeamService } from '../team/team.service.js';
import { GetProblemsQueryDto } from './dtos/get-problems-query.dto.js';
import { SubmitBodyValidator } from './request-validators/submit-body-validator.js';
import { UserException } from '../errors/user-error.js';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('problems')
export class ProblemController {
  constructor(
    private readonly validator: ProblemValidator,
    private readonly problemService: ProblemService,
    private readonly userService: UserService,
    private readonly teamService: TeamService,
  ) {}

  @Post(':id/submit')
  @FormDataRequest()
  async submitProblem(
    @Param('id') teamId: string,
    @Body('userName') userName?: string,
    @Body() body?: unknown,
  ) {
    if (!SubmitBodyValidator.validate(body)) {
      throw new UserException('Body가 올바르지 않습니다.');
    }

    if (userName === undefined) {
      throw new UserException('도전자의 이름을 필수로 입력해야 합니다.');
    }

    const problem = await this.problemService.getProblem(teamId);
    const user = await this.userService.getUserByName(userName);
    const team =
      user.teamId !== null ? await this.teamService.getTeam(user.teamId) : null;

    // 이미 풀었다면 성공한 것으로 처리한다.
    if (await this.problemService.isSolvedByUser(problem, user)) {
      return { result: 'failed', reason: ['이미 도전을 해결했습니다.'] };
    }

    if (!this.problemService.isValidUserForProblem(problem, user)) {
      return { result: 'failed', reason: ['도전자가 아닙니다.'] };
    }

    // 올바른지 검증한다.
    const validationResult = await this.validator.validate(problem, body, {
      user,
      team,
    });

    // 올바르다면 해결된 것으로 표시한다.
    if (validationResult.result === 'success') {
      await this.problemService.markAsSolved(problem, user);
    }

    return validationResult;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/solved-users')
  async getProblemSolvedUsers(
    @Param('id') problemId: string,
    @Query() { teamId }: GetSolvedUsersQueryDto,
  ) {
    const problem = await this.problemService.getProblem(problemId);
    const team = teamId ? await this.teamService.getTeam(teamId) : undefined;
    const users = await this.problemService.getSolvedUsers(problem, team);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        teamId: user.teamId,
        isLeader: user.isLeader,
      })),
    };
  }

  @Get(':id/solved-teams')
  async getSolvedTeams(@Param('id') problemId: string) {
    const problem = await this.problemService.getProblem(problemId);
    const teams = await this.problemService.getSolvedTeams(problem);

    return {
      teams: teams.map((team) => ({
        id: team.id,
        name: team.name,
      })),
    };
  }

  @Get()
  async getProblems(@Query() { problemIds }: GetProblemsQueryDto) {
    const problems = await this.problemService.getProblems(problemIds);
    return {
      problems: problems.map((problem) => ({
        id: problem.id,
        score: problem.score,
        isLeaderAssigned: problem.isLeaderAssigned,
        isNonLeaderAssigned: problem.isNonLeaderAssigned,
        requiredSolvedUserCount: problem.requiredSolvedUserCount,
        previousId: problem.previousId,
      })),
    };
  }
}
