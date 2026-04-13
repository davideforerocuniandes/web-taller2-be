// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY 3-D  ·  Implement UsersController
// ─────────────────────────────────────────────────────────────────────────────
// Wire up ALL 5 endpoints under the '/users' path.
// Use ParseIntPipe for the :id param in every route that needs it.
//
//   GET    /users
//   GET    /users/:id
//   POST   /users          (201)
//   PATCH  /users/:id
//   DELETE /users/:id
// ─────────────────────────────────────────────────────────────────────────────

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// TODO: import all decorators and pipes you need
import { UsersService } from './users.service';
import { TasksService } from '../tasks/tasks.service';
// TODO: import your DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
  ) {}

  // TODO: implement the 5 route handlers
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // B2: search by email – must be before :id to avoid NestJS treating "search" as an id
  @Get('search')
  search(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // B4: return tasks whose title starts with the user's name
  @Get(':id/tasks')
  findTasks(@Param('id', ParseIntPipe) id: number) {
    const user = this.usersService.findOne(id);
    return this.tasksService.findAll().filter((t) => t.title.startsWith(user.name));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
