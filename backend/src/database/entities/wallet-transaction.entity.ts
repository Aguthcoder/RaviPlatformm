import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';

export type WalletTransactionType = 'recharge' | 'debit';
export type WalletTransactionStatus = 'pending' | 'success' | 'failed';

@Entity({ name: 'wallet_transactions' })
export class WalletTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'event_id', nullable: true })
  eventId?: string;

  @Column({ name: 'type', length: 20 })
  type!: WalletTransactionType;

  @Column({ name: 'status', length: 20, default: 'pending' })
  status!: WalletTransactionStatus;

  @Column({ name: 'amount', type: 'int' })
  amount!: number;

  @Column({ name: 'balance_after', type: 'int', nullable: true })
  balanceAfter?: number;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'gateway', length: 50, nullable: true })
  gateway?: string;

  @Column({ name: 'gateway_authority', length: 120, nullable: true })
  gatewayAuthority?: string;

  @Column({ name: 'gateway_reference_id', length: 120, nullable: true })
  gatewayReferenceId?: string;

  @Column({ name: 'callback_url', nullable: true })
  callbackUrl?: string;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.walletTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => EventEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'event_id' })
  event?: EventEntity;
}
