import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';
import { EditUserDTO } from './dto';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUser(@GetUser() user: User) {
    return user;
  }

  @HttpCode(201)
  @UseGuards(JwtGuard)
  @Patch()
  async editUser(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDTO,
  ) {
    return this.service.editUser(userId, dto);
  }
}
