import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductsDto } from './dto/get-product.dto';
import { ProductsService } from './products.service';
import { Paginated } from 'src/common/pagination/pagination';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() options: GetProductsDto): Promise<Paginated<any>> {
    const products = await this.productsService.getProducts(options);
    return products;
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<any> {
    const product = await this.productsService.getProductById(id);
    return product;
  }
}
