import { Repository } from 'typeorm';
import { SubsribeEntity } from '../../entities/subscription.entity';
export declare class SubsribeRepository extends Repository<SubsribeEntity> {
    constructor(repository: Repository<SubsribeEntity>);
    findByToken(token: string): Promise<SubsribeEntity | null>;
}
