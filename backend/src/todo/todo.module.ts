import { Module } from '@nestjs/common';
import { TodoService } from './todo.service.js';
import { TodoController } from './todo.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports:[DatabaseModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
