import { Inject, Injectable, Logger } from '@nestjs/common';
import { CacheRepository } from './cache.repo';
import {
  AsyncMessage,
  AsyncMessageType,
  MailRegistrationNotification,
  MailWeatherNotification,
} from './dto/kafka.dto';
import { MailsService } from 'src/domens/mails/mails.service';
import { WeatherService } from 'src/domens/weather/weather.service';

@Injectable()
export class AsyncHandlingService {
  private readonly logger = new Logger(AsyncHandlingService.name);

  constructor(
    private readonly cacheRepository: CacheRepository,
    @Inject('MailsService') private readonly mailsService: MailsService,
    private readonly weatherService: WeatherService,
  ) {}

  async handleRegistrationTopicMessage(message: AsyncMessage): Promise<void> {
    if (message.type !== AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION) {
      throw new Error('Invalid message type');
    }

    const data = message.data as MailRegistrationNotification;
    return this.handleMessageWithCache(message.key, () =>
      this.mailsService.sendRegistrationMail(data.email, data.token),
    );
  }

  async handleWeatherTopicMessage(message: AsyncMessage): Promise<void> {
    if (message.type !== AsyncMessageType.MAIL_WEATHER_NOTIFICATION) {
      throw new Error('Invalid message type');
    }

    const data = message.data as MailWeatherNotification;
    return this.handleMessageWithCache(message.key, async () => {
      const weather = await this.weatherService.getWeather(data.city);
      await this.mailsService.sendWeatherMail(data.email, weather);
    });
  }

  private async handleMessageWithCache(
    key: string,
    handlerFn: () => Promise<void>,
  ): Promise<void> {
    const isCached = await this.cacheRepository.get(key);
    if (isCached) {
      return;
    }

    await this.cacheRepository.set(key);
    try {
      await handlerFn();
    } catch (error) {
      await this.cacheRepository.delete(key);
      this.logger.error(error);
      throw error;
    }
  }
}
