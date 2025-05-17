import { SubscribeType } from 'src/doments/subscription/dto/subscribe.type';
import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('subscriptions')
export class SubsribeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
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

  @Column({
    type: 'varchar',
    name: 'token',
    nullable: true,
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
