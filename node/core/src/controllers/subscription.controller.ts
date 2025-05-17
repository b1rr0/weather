import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from '../doments/subscription/dto/subscription.dto';
import { SubscribeService } from 'src/doments/subscription/subscribe.service';
import { WeatherService } from 'src/doments/weather/weather.service';
import { WeatherDto } from 'src/doments/weather/dto/weather.dto';

@ApiTags('subscription')
@Controller()
export class SubscriptionController {
  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get('weather')
  @ApiOperation({ summary: 'Get current weather for a city' })
  @ApiParam({
    name: 'city',
    description: 'City name',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Weather data' })
  @ApiResponse({ status: 400, description: 'Invalid city name' })
  async getWeather(@Param('city') city: string): Promise<WeatherDto> {
    return this.weatherService.getWeather(city);
  }

  @Post()
  @ApiOperation({ summary: 'Subscribe to weather updates' })
  @ApiResponse({
    status: 200,
    description: 'Subscription successful. Confirmation email sent.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  async subscribe(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<void> {
    console.log('New subscription:', createSubscriptionDto);
    await this.subscribeService.createSubscription(createSubscriptionDto);
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: 'Confirm email subscription' })
  @ApiParam({
    name: 'token',
    description: 'Confirmation token',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async confirmSubscription(@Param('token') token: string): Promise<void> {
    await this.subscribeService.confirmSubscription(token);
  }

  @Get('unsubscribe/:token')
  @ApiOperation({ summary: 'Unsubscribe from weather updates' })
  @ApiParam({
    name: 'token',
    description: 'Unsubscribe token',
    required: true,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async unsubscribe(@Param('token') token: string): Promise<void> {
    await this.subscribeService.unsubscribe(token);
  }
}
