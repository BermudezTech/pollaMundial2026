import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; contrasena: string }) {
    return this.authService.login(loginDto.email, loginDto.contrasena);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { uuid: string; contrasena: string }) {
    return this.authService.resetPassword(body.uuid, body.contrasena);
  }
}

