import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(@Req() req) : string | null {
    if (req.cookies && "refreshToken" in req.cookies && req.cookies.refreshToken.length > 0) {
      return req.cookies.refreshToken;
    }
    return null;
    // return req.cookies.refreshToken ?? req.cookies.refreshToken : null;
  }

  async validate(@Req() req, payload: any) {
    const refreshToken = req.cookies["refreshToken"];
    return {
      ...payload,
      refreshToken,
    };
  }
}
