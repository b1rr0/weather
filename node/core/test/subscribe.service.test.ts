import { Test, TestingModule } from '@nestjs/testing';
import { HasherService } from '../src/utils/hasher/hasher.service';
import { EventService } from '../src/doments/event/event.service';
import { KafkaService } from '../src/utils/kafka/kafka.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SubsribeRepository } from 'src/doments/subscription/subscribe.repository';
import { SubscribeService } from 'src/doments/subscription/subscribe.service';
import { SubscribeType } from 'src/doments/subscription/dto/subscribe.type';

describe('SubscribeService', () => {
  let service: SubscribeService;
  let hasherService: jest.Mocked<HasherService>;
  let subscriptionRepository: jest.Mocked<SubsribeRepository>;
  let eventService: jest.Mocked<EventService>;
  let kafkaService: jest.Mocked<KafkaService>;

  beforeEach(async () => {
    const mockHasherService = {
      hashData: jest.fn(),
    };

    const mockSubscriptionRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
      findByToken: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      findBy: jest.fn(),
    };

    const mockEventService = {
      createSubscribeEvent: jest.fn(),
    };

    const mockKafkaService = {
      write: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribeService,
        {
          provide: HasherService,
          useValue: mockHasherService,
        },
        {
          provide: SubsribeRepository,
          useValue: mockSubscriptionRepository,
        },
        {
          provide: EventService,
          useValue: mockEventService,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    service = module.get<SubscribeService>(SubscribeService);
    hasherService = module.get(HasherService);
    subscriptionRepository = module.get(SubsribeRepository);
    eventService = module.get(EventService);
    kafkaService = module.get(KafkaService);
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const createDto = {
        email: 'test@example.com',
        frequency: SubscribeType.DAILY,
        city: 'London',
      };

      const mockSubscription = {
        id: '1',
        email: createDto.email,
        subscribeType: createDto.frequency,
        city: createDto.city,
        token: 'hashed-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'test-token';
      const mockHashedToken = 'hashed-token';

      subscriptionRepository.findByEmail.mockResolvedValue(null);
      subscriptionRepository.create.mockReturnValue(mockSubscription as any);
      hasherService.hashData.mockResolvedValue(mockHashedToken);

      subscriptionRepository.manager.transaction = jest
        .fn()
        .mockImplementation(async (cb) => {
          const transactionalEntityManager = {
            save: jest.fn().mockResolvedValue(mockSubscription),
          };
          return cb(transactionalEntityManager);
        });

      const result = await service.createSubscription(createDto);

      expect(subscriptionRepository.findByEmail).toHaveBeenCalledWith(
        createDto.email,
      );
      expect(subscriptionRepository.create).toHaveBeenCalledWith({
        subscribeType: createDto.frequency,
        email: createDto.email,
        city: createDto.city,
      });
      expect(hasherService.hashData).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto = {
        email: 'test@example.com',
        frequency: SubscribeType.DAILY,
        city: 'London',
      };

      subscriptionRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(service.createSubscription(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('confirmSubscription', () => {
    it('should confirm subscription with valid token', async () => {
      const token = 'valid-token';
      const hashedToken = 'hashed-token';
      const mockSubscription = {
        id: '1',
        email: 'test@example.com',
        isConfirmed: false,
        city: 'London',
        token: 'hashed-token',
        subscribeType: SubscribeType.DAILY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      hasherService.hashData.mockResolvedValue(hashedToken);
      subscriptionRepository.findByToken.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockResolvedValue({
        ...mockSubscription,
        isConfirmed: true,
      });

      await service.confirmSubscription(token);

      expect(hasherService.hashData).toHaveBeenCalledWith(token);
      expect(subscriptionRepository.findByToken).toHaveBeenCalledWith(
        hashedToken,
      );
      expect(subscriptionRepository.save).toHaveBeenCalledWith({
        ...mockSubscription,
        isConfirmed: true,
      });
    });

    it('should throw NotFoundException with invalid token', async () => {
      const token = 'invalid-token';
      const hashedToken = 'hashed-token';

      hasherService.hashData.mockResolvedValue(hashedToken);
      subscriptionRepository.findByToken.mockResolvedValue(null);

      await expect(service.confirmSubscription(token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('unsubscribe', () => {
    it('should remove subscription with valid token', async () => {
      const token = 'valid-token';
      const hashedToken = 'hashed-token';
      const mockSubscription = {
        id: '1',
        email: 'test@example.com',
        city: 'London',
        isConfirmed: true,
        token: 'hashed-token',
        subscribeType: SubscribeType.DAILY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      hasherService.hashData.mockResolvedValue(hashedToken);
      subscriptionRepository.findByToken.mockResolvedValue(mockSubscription);

      await service.unsubscribe(token);

      expect(hasherService.hashData).toHaveBeenCalledWith(token);
      expect(subscriptionRepository.findByToken).toHaveBeenCalledWith(
        hashedToken,
      );
      expect(subscriptionRepository.remove).toHaveBeenCalledWith(
        mockSubscription,
      );
    });

    it('should throw NotFoundException with invalid token', async () => {
      const token = 'invalid-token';
      const hashedToken = 'hashed-token';

      hasherService.hashData.mockResolvedValue(hashedToken);
      subscriptionRepository.findByToken.mockResolvedValue(null);

      await expect(service.unsubscribe(token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('processCroneEvent', () => {
    it('should process confirmed subscriptions', async () => {
      const subscribeType = SubscribeType.DAILY;
      const mockSubscriptions = [
        {
          id: '1',
          email: 'test1@example.com',
          city: 'London',
          isConfirmed: true,
          token: 'hashed-token-1',
          subscribeType: SubscribeType.DAILY,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'test2@example.com',
          city: 'Paris',
          isConfirmed: true,
          token: 'hashed-token-2',
          subscribeType: SubscribeType.DAILY,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      subscriptionRepository.findBy.mockResolvedValue(mockSubscriptions);
      kafkaService.write.mockResolvedValue(undefined);

      await service.processCroneEvent(subscribeType);

      expect(subscriptionRepository.findBy).toHaveBeenCalledWith({
        subscribeType,
        isConfirmed: true,
      });
      expect(kafkaService.write).toHaveBeenCalledTimes(2);
    });

    it('should handle empty subscriptions list', async () => {
      const subscribeType = SubscribeType.DAILY;

      subscriptionRepository.findBy.mockResolvedValue([]);

      await service.processCroneEvent(subscribeType);

      expect(subscriptionRepository.findBy).toHaveBeenCalledWith({
        subscribeType,
        isConfirmed: true,
      });
      expect(kafkaService.write).not.toHaveBeenCalled();
    });
  });
});
