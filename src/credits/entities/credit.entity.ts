import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'credits' })
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      from: (value: Date) => value.toISOString().split('.').shift() + 'Z',
      to: (value: string) => new Date(value),
    },
  })
  createdAt: Date;
}
