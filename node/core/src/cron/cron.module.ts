import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { EventModule } from 'src/doments/event/event.module';
import { SubscribeModule } from 'src/doments/subscription/subscribe.module';
@Module({
  imports: [EventModule, SubscribeModule],
  providers: [CronService],
})
export class CronModule {}
