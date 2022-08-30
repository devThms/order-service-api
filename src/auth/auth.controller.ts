import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() login: LoginDto) {
    return this._authService.login(login);
  }

  @Put('update-credentials')
  async updateCredentials( @Body() credentials: LoginDto ) {
    return this._authService.updateCredentials(credentials);
  }
}
