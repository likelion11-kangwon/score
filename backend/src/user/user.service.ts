import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { User } from '@prisma/client';
import { UserException } from '../errors/user-error.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (user === null) {
      throw new UserException('사용자가 없습니다.');
    }
    return user;
  }

  async getUserByName(name: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { name } });
    if (user === null) {
      throw new UserException('사용자가 없습니다.');
    }
    return user;
  }
}
