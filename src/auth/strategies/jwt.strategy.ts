import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/payload.interface';
import { Status } from '../../common/status.enum';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../user/local/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private _authRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'DUDA_DE_TODO_ENCUENTRA_TU_PROPIA_LUZ',
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;

    const user = await this._authRepository.findOne({
      where: { username, status: Status.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
