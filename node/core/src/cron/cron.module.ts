import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { EventModule } from 'src/doments/event/event.module';
import { SubscrubeModule } from 'src/doments/subscription/subscrube.module';
@Module({
  imports: [EventModule, SubscrubeModule],
  providers: [CronService],
})
export class CronModule {}
