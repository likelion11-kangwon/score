import { IsArray, IsString, ValidateIf } from 'class-validator';

export class GetProblemsQueryDto {
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((_, value) => value !== undefined)
  problemIds?: string[];
}
