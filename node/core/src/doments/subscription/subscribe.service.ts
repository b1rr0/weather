import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    const subscribtionWithSameEmail =
      await this.subscriptionRepository.findByEmail(
        createSubscriptionDto.email,
      );
    if (subscribtionWithSameEmail) {
      throw new ConflictException('Email already exists');
    }

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
    this.logger.debug(
      `Confirming subscription with hashed token: ${hashedToken}`,
    );
    const subscription =
      await this.subscriptionRepository.findByToken(hashedToken);
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }
    subscription.isConfirmed = true;
    await this.subscriptionRepository.save(subscription);
    this.logger.log(`Subscription confirmed for email: ${subscription.email}`);
  }

  async unsubscribe(token: string): Promise<void> {
    const hashedToken = await this.hasherService.hashData(token);
    const subscription =
      await this.subscriptionRepository.findByToken(hashedToken);
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }
    await this.subscriptionRepository.remove(subscription);
    this.logger.log(`Unsubscribed user with email: ${subscription.email}`);
  }

  //TODO: Handle case where app crashes here Promise.all.. And not all events are processed
  async processCroneEvent(subscribeType: SubscribeType) {
    const subscriptions = await this.subscriptionRepository.findBy({
      subscribeType,
      isConfirmed: true,
    });
    if (subscriptions.length === 0) {
      this.logger.debug(`No subscriptions found for type: ${subscribeType}`);
      return;
    }

    this.logger.log(
      `Processing ${subscriptions.length} subscriptions for type: ${subscribeType}`,
    );
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
      this.logger.debug(
        `Sending weather notification message: ${JSON.stringify(message)}`,
      );
      await this.kafkaService.write(Topic.WEATHER, key, message);
    } catch (error) {
      this.logger.error('Failed to process event:', error);
    }
  }
}
