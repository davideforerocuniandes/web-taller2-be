// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY 2-B  ·  Build the UpdateTaskDto
// ─────────────────────────────────────────────────────────────────────────────
// Requirements:
//   - Same fields as CreateTaskDto but ALL fields are optional (it's a PATCH)
//   - Re-use the same validators but add @IsOptional() to each field
// ─────────────────────────────────────────────────────────────────────────────

// TODO: import validators from 'class-validator'
import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

const TaskStatus = { PENDING: 'pending', IN_PROGRESS: 'in-progress', DONE: 'done' } as const;
type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export class UpdateTaskDto {
  // TODO: implement the DTO (copy fields from CreateTaskDto and make them optional)
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
