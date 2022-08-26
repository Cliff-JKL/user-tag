import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Delete,
  Redirect,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  HttpCode,
  HttpStatus,
  Request
} from "@nestjs/common";
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from "../common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { PartialUserInterface } from "./interfaces/user.interface";
import { GetTagInterface } from "../tags/interfaces/tag.interface";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findOne(
    @CurrentUser() user: User
  ): Promise<GetUserDto> {
    const userData = await this.usersService.findOneByEmail(user.email);
    return new GetUserDto({
      uid: userData.uid,
      email: userData.email,
      nickname: userData.nickname,
      password: userData.password,
      tags: userData.tags,
    });
  }

  @Put()
  async update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<PartialUserInterface> {
    // TODO split in two diff functions?
    return this.usersService.update(user.uid, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentUser() user: User, @Request() req): Promise<void> {
    // TODO logout and delete
    req.logout(() => this.usersService.delete(user.uid));
  }

  @Get('tag/my')
  async findCreatedTags(@CurrentUser() user: User): Promise<{ tags: GetTagInterface[] }> {
    return this.usersService.findCreatedTags(user.uid);
  }

  @Post('tag')
  async addTags(@CurrentUser() user: User, @Body() dto: { tags: number[] }) {
    return this.usersService.addTags(user.uid, dto.tags);
  }

  @Delete('tag/:id')
  async deleteTag(
    @Param('id') id: number,
    @CurrentUser() user: User
  ): Promise<{ tags: GetTagInterface[] }> {
    return this.usersService.deleteTag(user.uid, +id);
  }
}
