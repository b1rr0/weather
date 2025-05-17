import { EventEntity } from 'src/entities/event.entity';
import { EntityManager, Repository } from 'typeorm';
export declare class EventRepository extends Repository<EventEntity> {
    constructor(repository: Repository<EventEntity>);
    saveEvent(transactionalEntityManager: EntityManager, event: EventEntity): Promise<EventEntity>;
}
