import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from "../common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(
    @CurrentUser() user: User
  ): Promise<User | undefined> {
    return this.usersService.findOne(user.email);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(user.uid, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@CurrentUser() user: User): Promise<void> {
    // logout and delete
    return this.usersService.delete(user.uid);
  }
}
