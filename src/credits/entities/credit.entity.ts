import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'credits' })
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
