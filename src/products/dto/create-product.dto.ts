import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
