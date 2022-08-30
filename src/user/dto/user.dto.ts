import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

import { Status } from '../../common/status.enum';
import { Role } from '../../role/local/role.entity';

@Exclude()
export class UserDTO {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  get Text(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Exclude()
  @IsString()
  readonly first_name: string;

  @Exclude()
  @IsString()
  readonly last_name: string;

  @Exclude()
  @IsString()
  readonly username: string;

  @Exclude()
  @IsString()
  readonly device_token: string;

  @Exclude()
  readonly status: Status;

  @Exclude()
  readonly role: Role;
}
