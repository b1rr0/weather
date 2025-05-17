import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../../entities/event.entity';
import { KafkaService } from '../../utils/kafka/kafka.service';
import { EventRepository } from './event.repository.ts';
@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventService, EventRepository, KafkaService],
  exports: [EventService],
})
export class EventModule {}
