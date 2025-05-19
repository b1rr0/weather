import { SubscribeType } from 'src/doments/subscription/dto/subscribe.type';
import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
} from 'typeorm';

@Entity('subscriptions')
@Index(['subscribeType', 'isConfirmed'])
export class SubsribeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'city',
    nullable: false,
  })
  city: string;

  @Column({
    type: 'boolean',
    name: 'is_confirmed',
    nullable: false,
    default: false,
  })
  isConfirmed: boolean;

  @Index()
  @Column({
    type: 'varchar',
    name: 'token',
    nullable: true,
    unique: true,
  })
  token: string;

  @Column({
    type: 'enum',
    enum: SubscribeType,
    name: 'subscribe_type',
    nullable: true,
  })
  subscribeType: SubscribeType;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    select: false,
  })
  updatedAt: Date;
}
