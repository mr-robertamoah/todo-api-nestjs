import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SigninDTO, SignupDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  async signup(@Body() dto: SignupDTO) {
    return await this.service.signup(dto);
  }

  @HttpCode(200)
  @Post('/signin')
  async signin(@Body() dto: SigninDTO) {
    return await this.service.signin(dto);
  }
}
