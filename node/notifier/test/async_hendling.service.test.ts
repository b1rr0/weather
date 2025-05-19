import { Test, TestingModule } from '@nestjs/testing';
import { AsyncHandlingService } from '../src/utility/async_handling/async_hendling.service';
import { CacheRepository } from '../src/utility/async_handling/cache.repo';
import { MailsService } from '../src/domens/mails/mails.service';
import { WeatherService } from '../src/domens/weather/weather.service';
import { AsyncMessageType } from '../src/utility/async_handling/dto/kafka.dto';
import { Logger } from '@nestjs/common';

describe('AsyncHandlingService', () => {
  let service: AsyncHandlingService;
  let cacheRepository: jest.Mocked<CacheRepository>;
  let mailsService: jest.Mocked<MailsService>;
  let weatherService: jest.Mocked<WeatherService>;

  beforeEach(async () => {
    const mockCacheRepo = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const mockMailsService = {
      sendRegistrationMail: jest.fn(),
      sendWeatherMail: jest.fn(),
    };

    const mockWeatherService = {
      getWeather: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsyncHandlingService,
        {
          provide: CacheRepository,
          useValue: mockCacheRepo,
        },
        {
          provide: 'MailsService',
          useValue: mockMailsService,
        },
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    service = module.get<AsyncHandlingService>(AsyncHandlingService);
    cacheRepository = module.get(CacheRepository);
    mailsService = module.get('MailsService');
    weatherService = module.get(WeatherService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  describe('handleRegistrationTopicMessage', () => {
    it('should throw error for invalid message type', async () => {
      const message = {
        type: AsyncMessageType.MAIL_WEATHER_NOTIFICATION,
        key: 'test-key',
        data: {
          email: 'test@example.com',
          city: 'London',
        },
      };

      await expect(
        service.handleRegistrationTopicMessage(message),
      ).rejects.toThrow('Invalid message type');
    });

    it('should handle registration message successfully', async () => {
      const message = {
        type: AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION,
        key: 'test-key',
        data: {
          email: 'test@example.com',
          token: 'test-token',
        },
      };

      cacheRepository.get.mockResolvedValue(null);
      mailsService.sendRegistrationMail.mockResolvedValue();

      await service.handleRegistrationTopicMessage(message);

      expect(cacheRepository.set).toHaveBeenCalledWith(message.key);
      expect(mailsService.sendRegistrationMail).toHaveBeenCalledWith(
        message.data.email,
        message.data.token,
      );
    });
  });

  describe('handleWeatherTopicMessage', () => {
    it('should throw error for invalid message type', async () => {
      const message = {
        type: AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION,
        key: 'test-key',
        data: {
          email: 'test@example.com',
          token: 'test-token',
        },
      };

      await expect(
        service.handleWeatherTopicMessage(message),
      ).rejects.toThrow('Invalid message type');
    });

    it('should handle weather message successfully', async () => {
      const message = {
        type: AsyncMessageType.MAIL_WEATHER_NOTIFICATION,
        key: 'test-key',
        data: {
          email: 'test@example.com',
          city: 'London',
        },
      };

      const weatherData = {
        temperature: 20,
        humidity: 50,
        description: 'sunny',
        city: 'London'
      };

      cacheRepository.get.mockResolvedValue(null);
      weatherService.getWeather.mockResolvedValue(weatherData);
      mailsService.sendWeatherMail.mockResolvedValue();

      await service.handleWeatherTopicMessage(message);

      expect(cacheRepository.set).toHaveBeenCalledWith(message.key);
      expect(weatherService.getWeather).toHaveBeenCalledWith(message.data.city);
      expect(mailsService.sendWeatherMail).toHaveBeenCalledWith(
        message.data.email,
        weatherData,
      );
    });
  });

  describe('handleMessageWithCache', () => {
    it('should skip processing if message is cached', async () => {
      const handlerFn = jest.fn();
      cacheRepository.get.mockResolvedValue('cached');

      await service['handleMessageWithCache']('test-key', handlerFn);

      expect(handlerFn).not.toHaveBeenCalled();
      expect(cacheRepository.set).not.toHaveBeenCalled();
    });

    it('should handle errors and clean up cache', async () => {
      const error = new Error('Test error');
      const handlerFn = jest.fn().mockRejectedValue(error);
      cacheRepository.get.mockResolvedValue(null);

      await expect(
        service['handleMessageWithCache']('test-key', handlerFn),
      ).rejects.toThrow(error);

      expect(cacheRepository.delete).toHaveBeenCalledWith('test-key');
      expect(Logger.prototype.error).toHaveBeenCalledWith(error);
    });
  });
});
