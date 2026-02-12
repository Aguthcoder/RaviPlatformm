import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventReservationEntity } from './event-reservation.entity';

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

  @Column({ name: 'capacity', type: 'int', default: 20 })
  capacity!: number;

  @Column({ name: 'reserved_count', type: 'int', default: 0 })
  reservedCount!: number;

  @Column({ name: 'price', type: 'int', default: 0 })
  price!: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate!: Date;

  @OneToMany(() => EventReservationEntity, (reservation) => reservation.event)
  reservations?: EventReservationEntity[];
}
