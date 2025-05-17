import { Injectable } from '@nestjs/common';
import { EventType, ProcessStatus } from './contants/event.constants';
import { EntityManager } from 'typeorm';
import { EventRepository } from './event.repository.ts';
import { EventEntity } from '../../entities/event.entity';
import { KafkaService } from 'src/utils/kafka/kafka.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  AsyncMessageType,
  MailRegistrationNotification,
  Topic,
} from 'src/utils/kafka/dto/kafka.dto';
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
      data: data,
      type: EventType.SUBSCRIPTION,
      status: ProcessStatus.PENDING,
    });

    return this.eventRepository.saveEvent(transactionalEntityManager, event);
  }

  //TO DO  add hendling for infinity PROCESSING events (after crash or other problems)
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
      const data = event.data as MailRegistrationNotification;
      const message = {
        type: AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION,
        data,
        key: event.id,
      };

      await this.kafkaService.write(Topic.SUBSCRIPTION, event.id, message);
      await this.eventRepository.update(event.id, {
        status: ProcessStatus.COMPLETED,
      });

    } catch (error) {
      console.error('Failed to process event:', error);
      await this.eventRepository.update(event.id, {
        status: ProcessStatus.PENDING,
      });
    }
  }
}
