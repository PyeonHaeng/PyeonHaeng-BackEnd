import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MainProduct } from './entities/main-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MainProduct])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductModule {}
