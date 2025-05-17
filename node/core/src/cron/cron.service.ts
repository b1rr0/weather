import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { SubscribeService } from 'src/doments/subscription/subscribe.service';
import { SubscribeType } from 'src/doments/subscription/dto/subscribe.type';
import { EventService } from 'src/doments/event/event.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly eventService: EventService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async sendDailyNotification() {
    await this.subscribeService.processCroneEvent(SubscribeType.DAILY);
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async sendHourlyNotification() {
    await this.subscribeService.processCroneEvent(SubscribeType.HOURLY);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendEvent() {
    await this.eventService.sendEvent();
  }
}
