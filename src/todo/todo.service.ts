import { Injectable } from '@nestjs/common';
import { CreateTodoDTO, EditTodoDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: number, dto: CreateTodoDTO) {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        ...dto,
      },
    });

    return todo;
  }

  async editTodo(
    todoInfo: { userId: number; todoId: number },
    dto: EditTodoDTO,
  ) {
    const todo = await this.prisma.todo.update({
      where: {
        userId: todoInfo.userId,
        id: todoInfo.todoId,
      },
      data: { ...dto },
    });

    return todo;
  }

  async deleteTodo(userId: number, todoId: number) {
    const todo = await this.prisma.todo.delete({
      where: {
        userId,
        id: todoId,
      },
    });

    return todo;
  }

  async getTodo(userId: number, todoId: number) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        userId,
        id: todoId,
      },
    });

    return todo;
  }

  async getTodos(userId: number) {
    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });

    return todos;
  }
}
