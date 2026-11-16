import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { DatabaseService } from '../database/database.service.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // checks if user exist or not
    const existingUser = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // hash the password here
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const payload = { userId: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...result } = user;
    return {
      access_token,
      user: result,
    };
  }

    async login(loginDto: LoginDto) {

      // Use your existing users service to find the user by email
      const user = await this.databaseService.user.findUnique({
        where: {email: loginDto.email}
      });

      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { userId: user.id, email: user.email };

      return {
        access_token: this.jwtService.sign(payload, {expiresIn : '14d'}),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }

    async getProfile(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
