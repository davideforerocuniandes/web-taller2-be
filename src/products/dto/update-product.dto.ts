import { IsString, IsNumber, IsPositive, IsOptional, MinLength, MaxLength } from 'class-validator';

// All fields are optional for a PATCH request
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
