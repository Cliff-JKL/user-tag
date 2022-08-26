import { Controller, Get, Post, Request, UseGuards, Body, Redirect, Res, HttpCode, HttpStatus, Next } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from "../users/entities/user.entity";
import { LoginUserInterface, PartialUserInterface } from "../users/interfaces/user.interface";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto : CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() userDto: CreateUserDto) {
    return this.authService.signin(userDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserInterface) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: any) {
    return this.authService.refreshTokens(user.uid, user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User, @Request() req) {
    req.logout(() => this.authService.logout(user.uid));
  }
}
