import { Injectable } from '@nestjs/common';
import { EventType, ProcessStatus } from './contants/event.constants';
import { EntityManager } from 'typeorm';
import { EventRepository } from './event.repository.ts';
import { EventEntity } from '../../entities/event.entity';
import { KafkaService } from 'src/utils/kafka/kafka.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async createSubscribeEvent(
    transactionalEntityManager: EntityManager,
    data: any,
  ) {
    const event = this.eventRepository.create({
      data: JSON.stringify(data),
      type: EventType.SUBSCRIPTION,
      status: ProcessStatus.PENDING,
    });

    return this.eventRepository.saveEvent(transactionalEntityManager, event);
  }

  //TO DO  add hendling for infinity PROCESSING events (after crash or other problems)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendEvent() {
    const events = await this.eventRepository.findBy({
      status: ProcessStatus.PENDING,
      type: EventType.SUBSCRIPTION,
    });
    if (events.length === 0) {
      return;
    }

    await this.eventRepository.update(
      events.map((event) => event.id),
      {
        status: ProcessStatus.PROCESSING,
      },
    );

    await Promise.all(events.map((event) => this.processEvent(event)));
  }

  private async processEvent(event: EventEntity) {
    try {
      const data = JSON.parse(event.data);
      await this.kafkaService.write('subscription', event.id.toString(), data);
      await this.eventRepository.update(event.id, {
        status: ProcessStatus.COMPLETED,
      });
    } catch (error) {
      console.error(error);
      await this.eventRepository.update(event.id, {
        status: ProcessStatus.PENDING,
      });
    }
  }
}
