import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AsyncHandlingService } from '../utility/async_handling/async_hendling.service';
import { AsyncMessage, Topic } from '../utility/async_handling/dto/kafka.dto';

@Controller()
export class WeatherNotificationController {
  private readonly logger = new Logger(WeatherNotificationController.name);
  constructor(private readonly asyncHandlingService: AsyncHandlingService) {}

  @MessagePattern(Topic.WEATHER)
  async handleWeatherMessage(@Payload() message: AsyncMessage) {
    console.log('message', message);
    if (!message) {
      this.logger.warn('Received empty message');
      return;
    }
    this.logger.log('Received weather message with key: ', message.key);
    await this.asyncHandlingService.handleWeatherTopicMessage(message);
  }

  @MessagePattern(Topic.SUBSCRIPTION)
  async handleRegistrationMessage(@Payload() message: AsyncMessage) {
    console.log('message', message);

    if (!message) {
      this.logger.warn('Received empty message');
      return;
    }
    this.logger.log('Received registration message with key: ', message.key);
    await this.asyncHandlingService.handleRegistrationTopicMessage(message);
  }
}
