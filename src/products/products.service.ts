import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable()
export class ProductsService {
  // In-memory "database" – a plain array
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, description: 'A powerful laptop' },
    { id: 2, name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
  ];
  private nextId = 3;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      name: dto.name,
      price: dto.price,
      description: dto.description ?? '',
    };
    this.products.push(product);
    return product;
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id); // reuses findOne – throws if not found
    Object.assign(product, dto);
    return product;
  }

  remove(id: number): Product {
    const product = this.findOne(id);
    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }
}
