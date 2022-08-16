import { IsString, IsInt, IsUUID } from 'class-validator';

export class CreateTagDto {
  // TODO delete
  @IsUUID()
  readonly creator: string;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly sortOrder: number;
}
