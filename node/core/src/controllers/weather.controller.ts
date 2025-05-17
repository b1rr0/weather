import { Controller, Get, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from 'src/doments/weather/weather.service';
import { WeatherDto } from 'src/doments/weather/dto/weather.dto';

@ApiTags('weather')
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('weather/:city')
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
}
