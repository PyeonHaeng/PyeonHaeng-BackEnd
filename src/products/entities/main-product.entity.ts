import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('main_products')
export class MainProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
