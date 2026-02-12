import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { UserTelegramLinkEntity } from './user-telegram-link.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  role?: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile?: ProfileEntity;

  @OneToMany(() => UserTelegramLinkEntity, (link) => link.user)
  telegramLinks?: UserTelegramLinkEntity[];
}
