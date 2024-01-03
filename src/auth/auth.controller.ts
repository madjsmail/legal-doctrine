import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user with email and password' })
  signIn(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginUserDto);
  }

  @Get('decode/:token')
  async decodeJwt(@Param('token') token: string) {
    try {
      const decodedPayload = await this.authService.decodeToken(token);
      return { decodedPayload };
    } catch (error) {
      return { error: error.message };
    }
  }
}
