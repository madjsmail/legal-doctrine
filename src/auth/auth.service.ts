import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userDocument } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
    private jwtService: JwtService,
  ) {}
  async validatePassword(
    userPassword: string,
    password: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, userPassword);

    return isPasswordValid;
  }
  async decodeToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.decode(token);
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  private async validateUserPassword(
    loginUserDto: LoginUserDto,
  ): Promise<JwtPayloadDto> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).exec();
    console.log(user);
    if (user && (await this.validatePassword(user.password, password))) {
      return {
        _id: user._id,
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        // emailValidationCode: user.emailValidationCode,
        isValidEmail: user.isValidEmail,
        phoneNumber: user.phoneNumber,
        // phoneValidationCode: user.phoneValidationCode,
        isValidPhone: user.isValidPhone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any;
    }

    return null;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ payload: any; accessToken: string }> {
    const payload = await this.validateUserPassword(loginUserDto);

    if (!payload) throw new UnauthorizedException('Credenciales inválidas');

    const accessToken = this.jwtService.sign(payload);

    return { payload, accessToken };
  }
}
