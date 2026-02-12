import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'interests', type: 'text', array: true, nullable: true })
  interests?: string[];

  @Column({ nullable: true })
  city?: string;
}
