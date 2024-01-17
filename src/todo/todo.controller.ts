import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../user/guard';
import { CreateTodoDTO, EditTodoDTO } from './dto';
import { GetUser } from '../user/decorator';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private service: TodoService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createTodo(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() dto: CreateTodoDTO,
  ) {
    return await this.service.createTodo(userId, dto);
  }

  @HttpCode(201)
  @Patch('/:id')
  @UseGuards(JwtGuard)
  async editTodo(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) todoId: number,
    @Body() dto: EditTodoDTO,
  ) {
    return await this.service.editTodo({ userId, todoId }, dto);
  }

  @HttpCode(204)
  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteTodo(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) todoId: number,
  ) {
    return await this.service.deleteTodo(userId, todoId);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getTodo(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) todoId: number,
  ) {
    return await this.service.getTodo(userId, todoId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getTodos(@GetUser('id', ParseIntPipe) userId: number) {
    return await this.service.getTodos(userId);
  }
}
