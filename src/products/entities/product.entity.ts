import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Promotion } from '../enums/promotion.enum';
import { Store } from '../enums/store.enum';
import { MainProduct } from './main-product.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'main_product_id' })
  mainProductId: number;

  @ManyToOne(() => MainProduct)
  @JoinColumn({ name: 'main_product_id' })
  mainProduct: MainProduct;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: Promotion })
  promotion: Promotion;

  @Column({ type: 'enum', enum: Store })
  store: Store;

  @Column({ type: 'date', name: 'event_date' })
  eventDate: Date;
}
