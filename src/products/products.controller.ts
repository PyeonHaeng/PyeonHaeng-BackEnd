import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductsDto } from './dto/get-product.dto';
import { ProductsService } from './products.service';
import { Paginated } from 'src/common/pagination/pagination';
import { Store } from './enums/store.enum';
import { Promotion } from './enums/promotion.enum';

@Controller('v2/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() options: GetProductsDto): Promise<Paginated<any>> {
    const products = await this.productsService.getProducts(options);
    return products;
  }

  @Get('count')
  async getProductsCount(
    @Query('store') store: Store,
    @Query('promotion') promotion: Promotion,
    @Query('date') date: Date,
  ): Promise<{ count: number }> {
    const count = await this.productsService.getProductsCount(
      store,
      promotion,
      date,
    );
    return { count };
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<any> {
    const product = await this.productsService.getProductById(id);
    return product;
  }
}
