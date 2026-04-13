// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY 2-A  ·  Add validators to this DTO
// ─────────────────────────────────────────────────────────────────────────────
// Requirements:
//   - title    → required string, between 3 and 100 characters
//   - description → optional string, max 300 characters
//   - status   → optional; if provided must be one of: 'pending' | 'in-progress' | 'done'
//               hint: look up @IsEnum() from class-validator
//
// Import what you need from 'class-validator' and add the decorators below.
// ─────────────────────────────────────────────────────────────────────────────

import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

const TaskStatus = { PENDING: 'pending', IN_PROGRESS: 'in-progress', DONE: 'done' } as const;
type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export class CreateTaskDto {
  // TODO: add validator decorators
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  // TODO: add validator decorators
  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  // TODO: add validator decorators
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
