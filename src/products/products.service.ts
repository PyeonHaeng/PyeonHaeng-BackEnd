import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, Like, Repository } from 'typeorm';
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

    if (options.order && options.order !== 'NORMAL') {
      queryBuilder.orderBy('product.price', options.order);
    }

    if (options.promotion !== 'ALL') {
      queryBuilder.andWhere('product.promotion = :promotion', {
        promotion: options.promotion,
      });
    }

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
      eventDate:
        new Date(product.eventDate).toISOString().split('.').shift() + 'Z',
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
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      promotion: product.promotion,
      store: product.store,
      eventDate:
        new Date(product.eventDate).toISOString().split('.').shift() + 'Z',
      imageUrl: product.mainProduct?.imageUrl || null,
    };
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

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mainProduct', 'mainProduct')
      .where('product.name LIKE :productName', {
        productName: `%${productName}%`,
      })
      .andWhere('product.eventDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .skip((offset - 1) * limit)
      .take(limit);

    const [products, count] = await queryBuilder.getManyAndCount();

    const results = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      promotion: product.promotion,
      store: product.store,
      eventDate:
        new Date(product.eventDate).toISOString().split('.').shift() + 'Z',
      imageUrl: product.mainProduct?.imageUrl || null,
    }));

    return {
      count,
      hasMore: offset * limit < count,
      results,
    };
  }

  async getPriceHistory(id: number): Promise<any[]> {
    const product = await this.productsRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const results = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mainProduct', 'mainProduct')
      .where('product.name = :name', { name: product.name })
      .andWhere('product.store = :store', { store: product.store })
      .orderBy('product.eventDate', 'DESC')
      .getMany();

    return results.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      promotion: product.promotion,
      store: product.store,
      eventDate:
        new Date(product.eventDate).toISOString().split('.').shift() + 'Z',
      imageUrl: product.mainProduct?.imageUrl || null,
    }));
  }
}
