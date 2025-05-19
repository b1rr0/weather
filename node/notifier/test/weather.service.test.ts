import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../src/domens/weather/weather.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for a valid city', async () => {
      const mockWeatherData = {
        data: {
          location: 'London',
          temperature: 20,
          condition: 'Sunny',
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockWeatherData);

      const result = await service.getWeather('London');
      expect(result).toEqual({
        city: 'London',
        data: {
          location: 'London',
          temperature: 20,
          condition: 'Sunny',
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/weather'),
        { params: { city: 'London' } },
      );
    });

    it('should throw BadRequestException when city is not found', async () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { error: { code: 1006 } },
        },
      };
      mockedAxios.get.mockRejectedValueOnce(error);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      await expect(service.getWeather('InvalidCity')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw original error for non-404 errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(networkError);
      mockedAxios.isAxiosError.mockReturnValueOnce(false);

      await expect(service.getWeather('London')).rejects.toThrow(networkError);
    });
  });
});
