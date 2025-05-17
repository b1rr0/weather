import { EntityManager } from 'typeorm';
import { EventRepository } from './event.repository.ts';
import { EventEntity } from '../../entities/event.entity';
import { KafkaService } from 'src/utils/kafka/kafka.service';
export declare class EventService {
    private readonly eventRepository;
    private readonly kafkaService;
    constructor(eventRepository: EventRepository, kafkaService: KafkaService);
    createSubscribeEvent(transactionalEntityManager: EntityManager, data: any): Promise<EventEntity>;
    sendEvent(): Promise<void>;
    processEvent(event: EventEntity): Promise<void>;
}
