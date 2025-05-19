import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubsribeEntity } from '../../entities/subscription.entity';

@Injectable()
export class SubsribeRepository extends Repository<SubsribeEntity> {
  constructor(
    @InjectRepository(SubsribeEntity)
    repository: Repository<SubsribeEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findByEmail(email: string): Promise<SubsribeEntity | null> {
    return this.findOneBy({ email: email });
  }

  findByToken(token: string): Promise<SubsribeEntity | null> {
    return this.findOneBy({ token: token });
  }
}
