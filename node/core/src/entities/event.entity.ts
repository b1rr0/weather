import {
  EventType,
  ProcessStatus,
} from 'src/doments/event/contants/event.constants';
import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  Index,
} from 'typeorm';

@Entity('events')
@Index('idx_events_status_type', ['status', 'type'])
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'status',
    nullable: false,
  })
  status: ProcessStatus;

  @Column({
    type: 'varchar',
    name: 'type',
    nullable: false,
  })
  type: EventType;

  @Column({
    type: 'jsonb',
    name: 'data',
    nullable: false,
  })
  data: any;

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
