
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    return { ...payload.user };
  }
// async validate(payload: JwtPayload): Promise<User> {
//     const { username } = payload;
//     const user = await this.collection.findOne({ username });

//     if (!user) {
//       throw new UnauthorizedException('JwtStrategy unauthorized');
//     }

//     return user;
//   }
}