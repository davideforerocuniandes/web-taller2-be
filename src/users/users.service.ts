// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY 3-C  ·  Implement UsersService
// ─────────────────────────────────────────────────────────────────────────────
// Create an in-memory service following the same pattern as ProductsService.
//
// Requirements:
//   - Store users in a private array
//   - Pre-populate with at least 2 seed users
//   - Implement: findAll, findOne(id), create(dto), update(id, dto), remove(id)
//   - findOne must throw NotFoundException when user is not found
//
// Interface to use:
//   export interface User {
//     id: number;
//     name: string;
//     email: string;
//     age: number;
//     role: string;
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// TODO: import NotFoundException and your DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
}

@Injectable()
export class UsersService {
  // TODO: implement the service
  private users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 22, role: 'student' },
  ];
  private nextId = 3;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  findByEmail(email: string): User {
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new NotFoundException(`No user found with email ${email}`);
    return user;
  }

  create(dto: CreateUserDto): User {
    if (this.users.find((u) => u.email === dto.email)) {
      throw new ConflictException('Email already registered');
    }
    const user: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
      age: dto.age,
      role: dto.role ?? 'student',
    };
    this.users.push(user);
    return user;
  }

  update(id: number, dto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, dto);
    return user;
  }

  remove(id: number): User {
    const user = this.findOne(id);
    this.users = this.users.filter((u) => u.id !== id);
    return user;
  }
}
