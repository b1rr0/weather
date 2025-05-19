import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../src/doments/event/event.service';
import { KafkaService } from '../src/utils/kafka/kafka.service';
import { EntityManager } from 'typeorm';
import { AsyncMessageType, Topic } from '../src/utils/kafka/dto/kafka.dto';
import { EventRepository } from '../src/doments/event/event.repository.ts';
import { EventType } from '../src/doments/event/contants/event.constants';
import { ProcessStatus } from '../src/doments/event/contants/event.constants';

import { UpdateResult } from 'typeorm';
import { EventEntity } from 'src/entities/event.entity';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: jest.Mocked<EventRepository>;
  let kafkaService: jest.Mocked<KafkaService>;

  const mockEntityManager = {} as EntityManager;

  beforeEach(async () => {
    const mockEventRepository = {
      create: jest.fn(),
      saveEvent: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
    };

    const mockKafkaService = {
      write: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventRepository,
          useValue: mockEventRepository,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get(EventRepository);
    kafkaService = module.get(KafkaService);
  });

  describe('createSubscribeEvent', () => {
    it('should create and save a subscription event', async () => {
      const mockData = { email: 'test@example.com' };
      const mockEvent: EventEntity = {
        id: '1',
        data: mockData,
        type: EventType.SUBSCRIPTION,
        status: ProcessStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      eventRepository.create.mockReturnValue(mockEvent);
      eventRepository.saveEvent.mockResolvedValue(mockEvent);

      const result = await service.createSubscribeEvent(
        mockEntityManager,
        mockData,
      );

      expect(eventRepository.create).toHaveBeenCalledWith({
        data: mockData,
        type: EventType.SUBSCRIPTION,
        status: ProcessStatus.PENDING,
      });
      expect(eventRepository.saveEvent).toHaveBeenCalledWith(
        mockEntityManager,
        mockEvent,
      );
      expect(result).toEqual(mockEvent);
    });
  });

  describe('sendEvent', () => {
    it('should process pending subscription events', async () => {
      const mockEvents: EventEntity[] = [
        {
          id: '1',
          data: { email: 'test@example.com' },
          type: EventType.SUBSCRIPTION,
          status: ProcessStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      eventRepository.findBy.mockResolvedValue(mockEvents);
      eventRepository.update.mockResolvedValue({} as UpdateResult);
      kafkaService.write.mockResolvedValue(undefined);

      await service.sendEvent();

      expect(eventRepository.findBy).toHaveBeenCalledWith({
        status: ProcessStatus.PENDING,
        type: EventType.SUBSCRIPTION,
      });
      expect(eventRepository.update).toHaveBeenCalledWith(['1'], {
        status: ProcessStatus.PROCESSING,
      });
      expect(kafkaService.write).toHaveBeenCalledWith(Topic.SUBSCRIPTION, '1', {
        type: AsyncMessageType.MAIL_REGISTRATION_NOTIFICATION,
        data: mockEvents[0].data,
        key: '1',
      });
      expect(eventRepository.update).toHaveBeenCalledWith('1', {
        status: ProcessStatus.COMPLETED,
      });
    });

    it('should handle no pending events', async () => {
      eventRepository.findBy.mockResolvedValue([]);

      await service.sendEvent();

      expect(eventRepository.findBy).toHaveBeenCalledWith({
        status: ProcessStatus.PENDING,
        type: EventType.SUBSCRIPTION,
      });
      expect(eventRepository.update).not.toHaveBeenCalled();
      expect(kafkaService.write).not.toHaveBeenCalled();
    });

    it('should revert event status to PENDING on error', async () => {
      const mockEvents: EventEntity[] = [
        {
          id: '1',
          data: { email: 'test@example.com' },
          type: EventType.SUBSCRIPTION,
          status: ProcessStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      eventRepository.findBy.mockResolvedValue(mockEvents);
      eventRepository.update.mockResolvedValue({} as UpdateResult);
      kafkaService.write.mockRejectedValue(new Error('Kafka error'));

      await service.sendEvent();

      expect(eventRepository.update).toHaveBeenCalledWith('1', {
        status: ProcessStatus.PENDING,
      });
    });
  });
});
