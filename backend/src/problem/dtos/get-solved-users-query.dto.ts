import { IsInt, IsNumber, IsPositive, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetSolvedUsersQueryDto {
  @IsPositive()
  @IsInt()
  @IsNumber()
  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }) => Number(value))
  teamId?: number;
}
