import { Injectable } from '@nestjs/common';
import { EventEntity } from 'src/entities/event.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(
    @InjectRepository(EventEntity)
    repository: Repository<EventEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async saveEvent(
    transactionalEntityManager: EntityManager,
    event: EventEntity,
  ) {
    return transactionalEntityManager.save(event);
  }
}
