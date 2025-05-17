import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HasherService } from '../../utils/hasher/hasher.service';
import { SubsribeRepository } from './subscribe.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { generateToken } from 'src/utils/generators/token.generator';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);

  constructor(
    private readonly hasherService: HasherService,
    private readonly subscriptionRepository: SubsribeRepository,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    subscription.token = await this.hasherService.hashData(generateToken());

    const savedSubscription =
      await this.subscriptionRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const saved = await transactionalEntityManager.save(subscription);
          return saved;
        },
      );

    return savedSubscription;
  }

  async confirmSubscription(token: string): Promise<void> {
    const hashedToken = await this.hasherService.hashData(token);
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
}
