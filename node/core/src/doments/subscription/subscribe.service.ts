import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HasherService } from '../../utils/hasher/hasher.service';
import { SubsribeRepository } from './subscribe.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { generateToken } from 'src/utils/generators/token.generator';
import { EventService } from '../event/event.service';
import { AsyncMessageType } from 'src/utils/kafka/dto/kafka.dto';
import { MailRegistrationNotification } from 'src/utils/kafka/dto/kafka.dto';
import { SubscribeType } from './dto/subscribe.type';
import { KafkaService } from 'src/utils/kafka/kafka.service';
import { Topic } from 'src/utils/kafka/dto/kafka.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);

  constructor(
    private readonly hasherService: HasherService,
    private readonly subscriptionRepository: SubsribeRepository,
    private readonly eventService: EventService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepository.create({
      subscribeType: createSubscriptionDto.frequency,
      email: createSubscriptionDto.email,
      city: createSubscriptionDto.city,
    });

    const token = generateToken();
    subscription.token = await this.hasherService.hashData(token);

    const savedSubscription =
      await this.subscriptionRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const saved = await transactionalEntityManager.save(subscription);

          const message: MailRegistrationNotification = {
            email: saved.email,
            token: token,
          };

          await this.eventService.createSubscribeEvent(
            transactionalEntityManager,
            message,
          );
          return saved;
        },
      );

    return savedSubscription;
  }

  async confirmSubscription(token: string): Promise<void> {
    const hashedToken = await this.hasherService.hashData(token);
    console.log('hashedToken', hashedToken);
    const subscription =
      await this.subscriptionRepository.findByToken(hashedToken);
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }
    subscription.isConfirmed = true;
    await this.subscriptionRepository.save(subscription);
  }

  async unsubscribe(token: string): Promise<void> {
    const hashedToken = await this.hasherService.hashData(token);
    const subscription =
      await this.subscriptionRepository.findByToken(hashedToken);
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }
    await this.subscriptionRepository.remove(subscription);
  }

  async processCroneEvent(subscribeType: SubscribeType) {
    const subscriptions = await this.subscriptionRepository.findBy({
      subscribeType,
      isConfirmed: true,
    });
    if (subscriptions.length === 0) {
      return;
    }

    await Promise.all(
      subscriptions.map((subscription) =>
        this.process(
          subscription.id + new Date().toISOString(),
          subscription.email,
          subscription.city,
        ),
      ),
    );
  }

  private async process(key: string, mail: string, city: string) {
    try {
      const message = {
        type: AsyncMessageType.MAIL_WEATHER_NOTIFICATION,
        data: {
          email: mail,
          city: city,
        },
        key,
      };
      console.log('message', message);
      await this.kafkaService.write(Topic.WEATHER, key, message);
    } catch (error) {
      console.error('Failed to process event:', error);
    }
  }
}
