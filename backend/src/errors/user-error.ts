import { HttpException } from '@nestjs/common';

export class UserException extends HttpException {
  constructor(message: string) {
    super(message, 400);
  }
}
