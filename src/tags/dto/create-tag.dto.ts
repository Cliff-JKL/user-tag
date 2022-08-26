import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  readonly sortOrder: number = 0;
}
