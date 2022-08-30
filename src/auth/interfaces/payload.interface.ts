// import { Role } from '../../role/local/role.entity';

export interface IJwtPayload {
  id: string;
  username: string;
  role: string;
  iat?: Date;
}
