import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Design DB schema', description: 'Draw the ER diagram', status: 'done' },
    { id: 2, title: 'Build REST API', description: 'Implement NestJS endpoints', status: 'in-progress' },
    { id: 3, title: 'Write tests', description: 'Unit + e2e test coverage', status: 'pending' },
  ];
  private nextId = 4;

  findAll(status?: string): Task[] {
    if (status) {
      return this.tasks.filter((t) => t.status === status);
    }
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'pending',
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, dto);
    return task;
  }

  remove(id: number): Task {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return task;
  }
}
