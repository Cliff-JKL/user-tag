import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(password: string, email: string, nickname: string): Promise<any> {
  //   const user = await this.usersService.findOne(email);
  //   if (user &&  user.nickname === nickname && user.password === password) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async signin(userData: any) {
    const user = await this.usersService.findOne(userData.email);
    if (user && user.password === userData.password) {
      const payload = {
        uid: user.uid,
        email: user.email,
        nickname: user.nickname,
        password: user.password,
      };

      return {
        token: this.jwtService.sign(payload),
        expire: "expire time (in sec)",
      };
    }

    return {
      token: this.jwtService.sign(undefined),
      expire: "expire time (in sec)",
    };
  }

  // TODO update
  // async login(user: any) {
  //   const payload = {
  //     nickname: user.nickname,
  //     uid: user.uid,
  //   };
  //   return {
  //     token: this.jwtService.sign(payload),
  //     expire: "expire time (in sec)",
  //   };
  // }
}
