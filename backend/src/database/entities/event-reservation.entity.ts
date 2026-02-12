import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'event_reservations' })
export class EventReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'event_id' })
  eventId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'seats', type: 'int', default: 1 })
  seats!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => EventEntity, (event) => event.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event!: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
