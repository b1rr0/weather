import { Injectable } from '@nestjs/common';
import { EventType, ProcessStatus } from './contants/event.constants';
import { EntityManager } from 'typeorm';
import { EventRepository } from './event.repository.ts';
import { EventEntity } from '../../entities/event.entity';
import { KafkaService } from 'src/utils/kafka/kafka.service';
import {
  AsyncMessageType,
  MailRegistrationNotification,
  Topic,
} from 'src/utils/kafka/dto/kafka.dto';
import { Logger } from '@nestjs/common';
@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async createSubscribeEvent(
    transactionalEntityManager: EntityManager,
    data: any,
  ) {
    this.logger.debug(
      `Creating subscription event with data: ${JSON.stringify(data)}`,
    );
    const event = this.eventRepository.create({
      data: data,
      type: EventType.SUBSCRIPTION,
      status: ProcessStatus.PENDING,
    });

    const savedEvent = await this.eventRepository.saveEvent(
      transactionalEntityManager,
      event,
    );
    this.logger.log(`Created subscription event with ID: ${savedEvent.id}`);
    return savedEvent;
  }

  //TO DO  add hendling for infinity PROCESSING events (after crash or other problems)
  async sendEvent() {
    const events = await this.eventRepository.findBy({
      status: ProcessStatus.PENDING,
      type: EventType.SUBSCRIPTION,
    });
    if (events.length === 0) {
      this.logger.debug('No pending subscription events found');
      return;
    }

    this.logger.log(`Found ${events.length} pending subscription events`);
    const eventIds = events.map((event) => event.id);
    this.logger.debug(
      `Updating status to PROCESSING for events: ${eventIds.join(', ')}`,
    );

    await this.eventRepository.update(eventIds, {
      status: ProcessStatus.PROCESSING,
    });

    await Promise.all(events.map((event) => this.processEvent(event)));
  }

  private async processEvent(event: EventEntity) {
    this.logger.debug(`Processing event ID: ${event.id}`);
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
      this.logger.log(`Successfully processed event ID: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to process event ${event.id}:`, error);
      this.logger.debug(`Reverting event ${event.id} status to PENDING`);
      await this.eventRepository.update(event.id, {
        status: ProcessStatus.PENDING,
      });
    }
  }
}
