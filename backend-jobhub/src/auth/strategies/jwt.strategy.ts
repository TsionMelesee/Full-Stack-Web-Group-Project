import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '12345',
    });
  }

  async validate(payload: any) {
    console.log('Validating token payload:', payload);
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
