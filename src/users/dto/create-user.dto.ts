import { IsString, IsEmail, Matches, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: "The password must be at least 8 characters" })
  @Matches(/\d+/, { message: "The password must contains at least one number character" })
  @Matches(/[A-Z]+/, { message: "The password must contains at least one uppercase letter character" })
  @Matches(/[a-z]+/, { message: "The password must contains at least one lowercase letter character" })
  password: string;
}
