import { Test, TestingModule } from '@nestjs/testing';
import { MailtraDemoApiService } from '../src/domens/mails/mailtra.demo.service';
import { WeatherWithCityDto } from '../src/domens/weather/dto/weather.dto';

describe('MailtraDemoApiService', () => {
  let service: MailtraDemoApiService;
  let mockTransport: any;

  beforeEach(async () => {
    mockTransport = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailtraDemoApiService],
    }).compile();

    service = module.get<MailtraDemoApiService>(MailtraDemoApiService);
    // @ts-ignore
    service.transport = mockTransport;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWeatherMail', () => {
    it('should send weather notification email', async () => {
      const email = 'test@example.com';
      const weatherData: WeatherWithCityDto = {
        city: 'Test City',
        temperature: 20,
        humidity: 50,
        description: 'sunny'
      };

      await service.sendWeatherMail(email, weatherData);

      expect(mockTransport.sendMail).toHaveBeenCalledWith({
        from: 'Acme <noreply@example.com>',
        to: email,
        subject: 'Weather Notification',
        html: expect.stringContaining('Test City')
      });
    });
  });

  describe('sendRegistrationMail', () => {
    it('should send registration notification email', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      await service.sendRegistrationMail(email, token);

      expect(mockTransport.sendMail).toHaveBeenCalledWith({
        from: 'Acme <noreply@example.com>',
        to: email,
        subject: 'Registration Notification',
        html: expect.stringContaining(token),
      });
    });
  });
});
