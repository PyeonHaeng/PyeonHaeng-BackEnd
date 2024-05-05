import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-product.dto';
import { Paginated } from 'src/common/pagination/pagination';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getProducts(options: GetProductsDto): Promise<Paginated<any>> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mainProduct', 'mainProduct');

    if (options.sort) {
      queryBuilder.orderBy('product.price', options.sort);
    }

    queryBuilder.andWhere('product.promotion = :promotion', {
      promotion: options.promotion,
    });

    queryBuilder.andWhere('product.store = :store', { store: options.store });

    const eventDate = new Date(options.date);
    const startDate = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      1,
    );
    const endDate = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth() + 1,
      0,
    );
    queryBuilder.andWhere({
      eventDate: Between(startDate, endDate),
    });

    const totalCount = await queryBuilder.getCount();

    queryBuilder.skip((options.offset - 1) * options.limit);
    queryBuilder.take(options.limit);

    const products = await queryBuilder.getMany();

    const hasMore = options.offset + products.length < totalCount;

    const results = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      promotion: product.promotion,
      store: product.store,
      eventDate: product.eventDate,
      imageUrl: product.mainProduct?.imageUrl || null,
    }));

    return {
      count: totalCount,
      hasMore,
      results: results,
    };
  }
}