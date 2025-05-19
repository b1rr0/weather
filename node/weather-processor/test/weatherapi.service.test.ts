import { Test, TestingModule } from '@nestjs/testing';
import { WeatherapiService } from '../src/domens/weatherapi.service';
import { WeatherDto } from '../src/domens/weather/dto/weather.dto';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherapiService', () => {
  let service: WeatherapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherapiService],
    }).compile();

    service = module.get<WeatherapiService>(WeatherapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateWeather', () => {
    const mockWeatherResponse = {
      data: {
        current: {
          temp_c: 20,
          humidity: 50,
          condition: {
            text: 'Sunny',
          },
        },
      },
    };

    const expectedWeatherData: WeatherDto = {
      temperature: 20,
      humidity: 50,
      description: 'Sunny',
    };

    it('should return weather data for valid city', async () => {
      mockedAxios.get.mockResolvedValueOnce(mockWeatherResponse);

      const result = await service.calculateWeather('London');

      expect(result).toEqual(expectedWeatherData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://api.weatherapi.com/v1/current.json',
        {
          params: {
            q: 'London',
            key: expect.any(String),
            aqi: 'no',
          },
        },
      );
    });

    it('should throw NotFoundException for invalid city', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            error: {
              code: 1006,
            },
          },
        },
        isAxiosError: true,
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      await expect(service.calculateWeather('InvalidCity')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw original error for other errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(service.calculateWeather('London')).rejects.toThrow(
        networkError,
      );
    });
  });
});
