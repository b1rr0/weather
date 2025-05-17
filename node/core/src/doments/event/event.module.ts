import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../entities/event.entity';
import { EventRepository } from './event.repository.ts';
import { KafkaModule } from 'src/utils/kafka/kafka.module';
import { KafkaService } from 'src/utils/kafka/kafka.service';
@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), KafkaModule],
  providers: [EventService, EventRepository, KafkaService],
  exports: [EventService, EventRepository],
})
export class EventModule {}
