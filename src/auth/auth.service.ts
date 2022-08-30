import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { IJwtPayload } from './interfaces/payload.interface';
import { Repository } from 'typeorm';
import { User } from '../user/local/user.entity';
import { Inject } from '@nestjs/common';
import { Status } from '../common/status.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY')
    private _authRepository: Repository<User>,
    private readonly _jwtService: JwtService,
  ) {}

  /**
   * Permite el logueo en el sistema.
   * @param loginDto Objeto con las credenciales para el logueo
   */
  async login(loginDto: LoginDto): Promise<{ token: String, data: IJwtPayload }> {
    const { username, password } = loginDto;

    const user = await this._authRepository.findOne({
      where: { username, status: Status.ACTIVE },
      relations: ['role']
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const data: IJwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role.name,
    };

    const token = await this._jwtService.sign(data);

    return { token, data };
  }

  async updateCredentials( loginDto: LoginDto ): Promise<User> {
    
    const { username, password } = loginDto;

    const user = await this._authRepository.findOne({
      where: { username, status: Status.ACTIVE }
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    let salt = await genSalt(10);
    user.password = await hash(password, salt);

    await this._authRepository.update(user.id, user);

    const userUpdated = await this._authRepository.findOne(user.id);

    return userUpdated;

  }
}
