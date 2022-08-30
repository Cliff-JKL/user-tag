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
  async signup(@Res({ passthrough: true }) res, @Body() createUserDto : CreateUserDto) {
    const tokenData = await this.authService.signUp(createUserDto);
    // add secure: true in options ?
    res.cookie("refreshToken", tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      path: "/api/auth",
      httpOnly: true
    });
    return {
      token: tokenData.accessToken,
      expire: tokenData.atExpire / 1000,
    };
  }

  @Post('signin')
  async signin(@Res({ passthrough: true }) res, @Body() userDto: CreateUserDto): Promise<{ token: string, expire: number }> {
    const tokenData = await this.authService.signin(userDto);
    // add secure: true in options ?
    res.cookie("refreshToken", tokenData.refreshToken, {
      maxAge: tokenData.rtExpire,
      path: "/api/auth",
      httpOnly: true
    });
    return {
      token: tokenData.accessToken,
      expire: tokenData.atExpire / 1000,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserInterface) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() user: any, @Res({ passthrough: true }) res) {
    const refreshedTokenData = await this.authService.refreshTokens(user.uid, user.refreshToken);
    res.cookie("refreshToken", refreshedTokenData.refreshToken, {
      maxAge: refreshedTokenData.rtExpire,
      path: "/api/auth",
      httpOnly: true
    });
    return {
      token: refreshedTokenData.accessToken,
      expire: refreshedTokenData.atExpire / 1000,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User, @Request() req, @Res({ passthrough: true }) res) {
    req.logout(() => {
      this.authService.logout(user.uid);
      res.cookie("refreshToken", "", {
        expires: new Date(),
        path: "/api/auth",
      });
    });
  }
}
