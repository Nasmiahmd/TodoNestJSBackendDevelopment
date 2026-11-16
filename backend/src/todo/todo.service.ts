import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, createTodoDto: CreateTodoDto) {
    return this.databaseService.todo.create({
      data: {
        text: createTodoDto.text,
        completed: createTodoDto.completed,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.databaseService.todo.findMany({
      where: { userId },
    });
  }

  // findOne(userId: string, id: string) {
  //   const todo = this.databaseService.todo.findUnique({
  //     where: {id, userId}
  //   })

  //   return
  // }

  async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.databaseService.todo.findUnique({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(
        `Todo with ID ${id} not found or access denied.`,
      );
    }

    return this.databaseService.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async remove(id: string, userId: string) {
    const todo = await this.databaseService.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found or access denied.`);
    }

    return this.databaseService.todo.delete({
      where: { id },
    });
  }
}
