import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Problem, Team, User } from '@prisma/client';
import { ExecaChildProcess, execa } from 'execa';
import moment from 'moment';
import { MemoryStoredFile } from 'nestjs-form-data';

export const VALIDATORS_SYMBOL = Symbol('Validators');

@Injectable()
export class ProblemValidator {
  private readonly logger = new Logger(ProblemValidator.name);

  containerBinary: string;

  constructor(private readonly configService: ConfigService) {
    this.containerBinary = configService.getOrThrow('CONTAINER_BINARY');
  }

  private async docker(
    args: string[],
    input: string,
  ): Promise<ExecaChildProcess<string>> {
    const command = this.containerBinary;
    this.logger.log(`Executing: ${command} ${args.join(' ')}`);
    return execa(command, args, { input });
  }

  private encodeFile(file: MemoryStoredFile): string {
    return file.buffer.toString('base64');
  }

  readonly TIME_LIMIT = moment('2023-04-15 23:59:59');

  async validate(
    problem: Problem,
    input: Record<string, string | MemoryStoredFile>,
    request: {
      user: User;
      team: Team | null;
    },
  ): Promise<
    | {
        result: 'success' | 'error';
      }
    | {
        result: 'failed';
        reason: string[];
      }
  > {
    console.log(moment());
    console.log(this.TIME_LIMIT);

    if (moment().isAfter(this.TIME_LIMIT)) {
      console.log('time limit over');

      return { result: 'failed', reason: ['제출 기한이 지났습니다.'] };
    }

    const inputString = JSON.stringify({
      ...Object.fromEntries(
        await Promise.all(
          Object.entries(input).map(async ([key, value]) => [
            key,
            typeof value === 'string' ? value : this.encodeFile(value),
          ]),
        ),
      ),
      request,
    });

    const result = await this.docker(
      ['run', '-i', '--rm', `validator-${problem.id}`],
      inputString,
    );

    const stdout = result.stdout.trim();

    if (result.exitCode !== 0) return { result: 'error' };

    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.trim() === 'OK') {
        return { result: 'success' };
      }

      if (line.startsWith('LOG: ')) {
        this.logger.log(`[CONTAINER] ${line.substring('LOG: '.length)}`);
      }

      if (line.startsWith('ERROR: ')) {
        return {
          result: 'failed',
          reason: lines
            .filter((line) => line.startsWith('ERROR: '))
            .map((line) => line.substring('ERROR: '.length)),
        };
      }
    }

    if (stdout === 'OK') {
      return { result: 'success' };
    }

    return { result: 'failed', reason: [] };
  }
}
