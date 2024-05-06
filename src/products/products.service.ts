import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, Like, Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-product.dto';
import { Paginated } from 'src/common/pagination/pagination';
import type { Promotion } from './enums/promotion.enum';
import type { Store } from './enums/store.enum';

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
      results,
    };
  }

  async getProductById(id: number): Promise<any> {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mainProduct', 'mainProduct')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      promotion: product.promotion,
      store: product.store,
      eventDate: product.eventDate,
      imageUrl: product.mainProduct?.imageUrl || null,
    };
  }

  async getProductsCount(
    store: Store,
    promotion: Promotion,
    date: Date,
  ): Promise<number> {
    const eventDate = new Date(date);
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
    const count = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.store = :store', { store })
      .andWhere('product.promotion = :promotion', { promotion })
      .andWhere({ eventDate: Between(startDate, endDate) })
      .getCount();
    console.log(count);
    return count;
  }

  async searchProducts(
    productName: string,
    date: string,
    offset: number,
    limit: number,
  ): Promise<Paginated<any>> {
    const eventDate = new Date(date);
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

    const [products, count] = await this.productsRepository.findAndCount({
      where: {
        name: Like(`%${productName}%`),
        eventDate: Between(startDate, endDate),
      },
      skip: (offset - 1) * limit,
      take: limit,
    });

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
      count,
      hasMore: offset * limit < count,
      results,
    };
  }
}
