import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubsribeRepository } from './subscribe.repository';
import { HasherModule } from 'src/utils/hasher/hasher.module';
import { SubscribeService } from './subscribe.service';
import { SubsribeEntity } from 'src/entities/subscription.entity';
import { EventModule } from '../event/event.module';
import { WeatherModule } from '../weather/weather.module';
import { KafkaModule } from 'src/utils/kafka/kafka.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([SubsribeEntity]),
    HasherModule,
    EventModule,
    WeatherModule,
    KafkaModule,
  ],
  providers: [SubscribeService, SubsribeRepository],
  exports: [SubscribeService, SubsribeRepository],
})
export class SubscribeModule {}
