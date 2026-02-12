import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'category', nullable: true })
  category?: string;

  @Column({ name: 'tags', type: 'text', array: true, nullable: true })
  tags?: string[];

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate!: Date;
}
