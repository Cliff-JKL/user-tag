import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserInterface, PartialUserInterface } from "../users/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: any) {
    const payload = {
      uid: user.uid,
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    };
    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.accessSecret,
        expiresIn: "30m"
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: "7d"
      }),
    ])

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      atExpire: 30 * 60 * 1000,
      rtExpire: 7 * 24 * 60 * 60 * 1000,
    };
  }

  async signUp(userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    return await this.generateTokens(user);
    // @ts-ignore
    // const decodedJwt: { [key: string]: any } = this.jwtService.decode(tokens.accessToken);
  }

  async signin(userDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (user && bcrypt.compareSync(userDto.password, user.password)) {
      return await this.generateTokens(user);
    }

    throw new NotFoundException();
  }

  async login(loginUserDto: LoginUserInterface) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    if (user && bcrypt.compareSync(loginUserDto.password, user.password)) {
      return await this.generateTokens(user);
    }

    throw new NotFoundException();
  }

  async logout(userUid: string) {
    // TODO update refreshToken in DB (if its not null) to null
  }

  async updateRefreshToken(userUid: string, refreshToken: string) {
    // TODO: update rt in DB
  }

  async refreshTokens(userUid: string, refreshToken: string) {
    const user = await this.usersService.findOneByUid(userUid);
    if (!user) {
      throw new NotFoundException();
    }

    // const rtMatches = await argon.verify(user.hashedRt, rt);
    // if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.uid, tokens.refreshToken);

    return tokens;
  }
}
