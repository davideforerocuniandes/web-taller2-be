// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY 3-B  ·  Create UpdateUserDto
// ─────────────────────────────────────────────────────────────────────────────
// Same as CreateUserDto but every field is optional (PATCH semantics).
// ─────────────────────────────────────────────────────────────────────────────

// TODO: your code here
import {
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(120)
  age?: number;

  @IsEnum(['student', 'teacher', 'admin'])
  @IsOptional()
  role?: 'student' | 'teacher' | 'admin';
}
