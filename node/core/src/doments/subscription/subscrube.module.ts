import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubsribeRepository } from './subscribe.repository';
import { HasherModule } from 'src/utils/hasher/hasher.module';
import { SubscribeService } from './subscribe.service';
import { SubsribeEntity } from 'src/entities/subscription.entity';
@Module({
  imports: [TypeOrmModule.forFeature([SubsribeEntity]), HasherModule],
  providers: [SubscribeService, SubsribeRepository],
  exports: [SubscribeService, SubsribeRepository],
})
export class SubscrubeModule {}
