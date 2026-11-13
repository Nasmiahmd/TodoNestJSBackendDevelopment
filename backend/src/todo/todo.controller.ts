import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

// Optional: Define an interface for the authenticated request shape
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createTodoDto: CreateTodoDto) {
    const userId = req.user.userId;
    return this.todoService.create(userId, createTodoDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId
    return this.todoService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.todoService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, userId: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, userId: string) {
    return this.todoService.remove(id, userId);
  }
}
