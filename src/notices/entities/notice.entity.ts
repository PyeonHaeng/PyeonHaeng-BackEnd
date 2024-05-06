import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
