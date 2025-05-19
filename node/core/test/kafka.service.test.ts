import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from '../src/utils/kafka/kafka.service';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import {
  AsyncMessage,
  AsyncMessageType,
  MailRegistrationNotification,
  MailWeatherNotification,
} from '../src/utils/kafka/dto/kafka.dto';

jest.mock('kafkajs');

describe('KafkaService', () => {
  let service: KafkaService;
  let mockProducer: jest.Mocked<Producer>;

  beforeEach(async () => {
    mockProducer = {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    const mockKafka = {
      producer: jest.fn().mockReturnValue(mockProducer),
    };

    (Kafka as jest.Mock).mockImplementation(() => mockKafka);

    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaService],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      mockProducer.connect.mockResolvedValue(undefined);
      expect(mockProducer.connect).toHaveBeenCalled();
    });

    it('should handle connection error', async () => {
      const error = new Error('Connection failed');
      mockProducer.connect.mockRejectedValue(error);

      const newService = new KafkaService();
      expect(newService).toBeDefined();
    });
  });

  describe('write', () => {
    it('should write message successfully', async () => {
      const topic = 'test-topic';
      const key = 'test-key';
      const message: AsyncMessage = {
        type: AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION,
        key: 'test',
        data: {
          email: 'test@example.com',
          token: 'test-token',
        } as MailRegistrationNotification,
      };

      mockProducer.send.mockResolvedValue([
        { topicName: topic, partition: 0, errorCode: 0 },
      ] as RecordMetadata[]);

      await service.write(topic, key, message);

      expect(mockProducer.send).toHaveBeenCalledWith({
        topic,
        messages: [
          {
            key: key,
            value: JSON.stringify(message),
          },
        ],
      });
    });

    it('should handle write error', async () => {
      const error = new Error('Write failed');
      mockProducer.send.mockRejectedValue(error);

      const message: AsyncMessage = {
        type: AsyncMessageType.MAIL_WEATHER_NOTIFICATION,
        key: 'test',
        data: {
          email: 'test@example.com',
          city: 'London',
          weather: 'sunny',
        } as MailWeatherNotification,
      };

      await service.write('topic', 'key', message);
      expect(mockProducer.send).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      mockProducer.disconnect.mockResolvedValue(undefined);

      await service.disconnect();

      expect(mockProducer.disconnect).toHaveBeenCalled();
    });
  });
});
