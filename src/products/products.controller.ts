import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetProductsDto } from './dto/get-product.dto';
import { ProductsService } from './products.service';
import { Paginated } from 'src/common/pagination/pagination';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto/paginated.dto';

@ApiTags('Products')
@Controller('v2/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get products' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PaginatedDto,
  })
  @Get()
  async getProducts(@Query() options: GetProductsDto): Promise<Paginated<any>> {
    const products = await this.productsService.getProducts(options);
    return products;
  }

  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'The date must be declared in iso8601 (e.g. 2024-05-01)',
    type: Date,
  })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PaginatedDto,
  })
  @Get('search')
  async searchProducts(
    @Query('product_name') productName: string,
    @Query('date') date: string,
    @Query('offset') offset = 1,
    @Query('limit') limit = 10,
  ): Promise<Paginated<any>> {
    return this.productsService.searchProducts(
      productName,
      date,
      offset,
      limit,
    );
  }

  @ApiOperation({ summary: 'Get a specific product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: PaginatedDto,
  })
  @Get(':id(\\d+)')
  async getProductById(@Param('id') id: number): Promise<any> {
    const product = await this.productsService.getProductById(id);
    return product;
  }
}
