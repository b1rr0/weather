import { HasherService } from '../../utils/hasher/hasher.service';
import { SubsribeRepository } from './subscribe.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscribeService {
    private readonly hasherService;
    private readonly subscriptionRepository;
    private readonly logger;
    constructor(hasherService: HasherService, subscriptionRepository: SubsribeRepository);
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<import("../../entities/subscription.entity").SubsribeEntity>;
    confirmSubscription(token: string): Promise<void>;
    unsubscribe(token: string): Promise<void>;
}
