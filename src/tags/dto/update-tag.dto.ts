import { IsInt, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTagDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  readonly sortOrder: number;
}