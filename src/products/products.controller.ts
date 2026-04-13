import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// @Controller sets the base path for all routes in this class
@Controller('products')
export class ProductsController {
  // NestJS injects the service automatically via the constructor
  constructor(private readonly productsService: ProductsService) {}

  // GET /products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/:id
  // ParseIntPipe converts the string param to a number and throws 400 if invalid
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // POST /products
  // @Body() extracts the request body; ValidationPipe validates it against CreateProductDto
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // PATCH /products/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
