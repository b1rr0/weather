import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './configs/typeorm.config';
import { HasherService } from './utils/hasher/hasher.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { HasherModule } from './utils/hasher/hasher.module';
import { SubscrubeModule } from './doments/subscription/subscrube.module';
import { WeatherModule } from './doments/weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './doments/event/event.module';
import { WeatherController } from './controllers/weather.controller';
import { CronModule } from './cron/cron.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig),
    HasherModule,
    SubscrubeModule,
    WeatherModule,
    ScheduleModule.forRoot(),
    EventModule,
    CronModule,
  ],
  controllers: [SubscriptionController, WeatherController],
  providers: [HasherService, SubscrubeModule, WeatherModule, EventModule],
})
export class AppModule {}
