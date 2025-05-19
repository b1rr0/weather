import { Test, TestingModule } from '@nestjs/testing';
import { WeatherProcessorService } from '../src/domens/weather/weather.processor.service';
import { RecentWeatherRepository } from '../src/domens/weather/recent.weather.repo';
import { WeatherapiService } from '../src/domens/weatherapi.service';
import { WeatherDto } from '../src/domens/weather/dto/weather.dto';
import { redLock } from '../src/config/redis.config';
import { Lock } from 'redlock';

describe('WeatherProcessorService', () => {
  let service: WeatherProcessorService;
  let recentWeatherRepository: jest.Mocked<RecentWeatherRepository>;
  let weatherapiService: jest.Mocked<WeatherapiService>;

  const mockWeatherData: WeatherDto = {
    temperature: 20,
    description: 'Sunny',
    humidity: 50,
  };

  beforeEach(async () => {
    const mockRecentWeatherRepository = {
      getByCity: jest.fn(),
      setByCity: jest.fn(),
    };

    const mockWeatherapiService = {
      calculateWeather: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherProcessorService,
        {
          provide: RecentWeatherRepository,
          useValue: mockRecentWeatherRepository,
        },
        {
          provide: WeatherapiService,
          useValue: mockWeatherapiService,
        },
      ],
    }).compile();

    service = module.get<WeatherProcessorService>(WeatherProcessorService);
    recentWeatherRepository = module.get(RecentWeatherRepository);
    weatherapiService = module.get(WeatherapiService);
  });

  describe('getData', () => {
    it('should return cached data if available', async () => {
      recentWeatherRepository.getByCity.mockResolvedValueOnce(mockWeatherData);
      const result = await service.getData('London');
      expect(result).toEqual(mockWeatherData);
      expect(recentWeatherRepository.getByCity).toHaveBeenCalledWith('London');
      expect(weatherapiService.calculateWeather).not.toHaveBeenCalled();
    });

    it('should fetch and cache new data if no cached data exists', async () => {
      recentWeatherRepository.getByCity.mockResolvedValueOnce(null);
      weatherapiService.calculateWeather.mockResolvedValueOnce(mockWeatherData);

      const mockLock = {
        redlock: redLock,
        resources: ['test'],
        value: 'test',
        attempts: 1,
        release: jest.fn(),
      } as unknown as Lock;

      jest.spyOn(redLock, 'acquire').mockResolvedValueOnce(mockLock);

      const result = await service.getData('London');

      expect(result).toEqual(mockWeatherData);
      expect(recentWeatherRepository.setByCity).toHaveBeenCalledWith(
        'London',
        mockWeatherData,
      );
      expect(mockLock.release).toHaveBeenCalled();
    });

    it('should handle double-check pattern correctly', async () => {
      recentWeatherRepository.getByCity.mockResolvedValueOnce(null);
      recentWeatherRepository.getByCity.mockResolvedValueOnce(mockWeatherData);

      const mockLock = {
        redlock: redLock,
        resources: ['test'],
        value: 'test',
        attempts: 1,
        release: jest.fn(),
      } as unknown as Lock;

      jest.spyOn(redLock, 'acquire').mockResolvedValueOnce(mockLock);

      const result = await service.getData('London');

      expect(result).toEqual(mockWeatherData);
      expect(weatherapiService.calculateWeather).not.toHaveBeenCalled();
      expect(mockLock.release).toHaveBeenCalled();
    });
  });
});
