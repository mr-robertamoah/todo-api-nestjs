import { TodoStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EditTodoDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status: TodoStatus;
}
