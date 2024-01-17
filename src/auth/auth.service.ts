import { ForbiddenException, Injectable } from '@nestjs/common';
import { SigninDTO, SignupDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signup(dto: SignupDTO) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await argon.hash(dto.password),
        },
      });

      return await this.signToken(user);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ForbiddenException('Email Taken');

      throw err;
    }
  }

  async signin(dto: SigninDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect Email');

    const matches = argon.verify(user.password, dto.password);
    if (!matches) throw new ForbiddenException('Incorrect Password');

    return await this.signToken(user);
  }

  async signToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: accessToken };
  }
}
