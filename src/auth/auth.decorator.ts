import { createParamDecorator } from '@nestjs/common';
import { UserDTO } from '../user/dto/user.dto';

export const GetUserAuth = createParamDecorator(
  (data, req): UserDTO => {
    return req.user;
  },
);
