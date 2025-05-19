import { Injectable, Logger } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { AsyncMessage } from './dto/kafka.dto';
import { Kafka } from 'kafkajs';
import kafkaConfig from 'src/configs/kafka.config';
@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private producer: Producer;

  constructor() {
    const kafka = new Kafka(kafkaConfig);
    this.producer = kafka.producer();
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Connected to Kafka');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka', error);
    }
  }

  async write(
    topic: string,
    key: string,
    message: AsyncMessage,
  ): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: key,
            value: JSON.stringify(message),
          },
        ],
      });
      this.logger.log('Message sent to Kafka', key);
    } catch (error) {
      this.logger.error('Failed to write to Kafka', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Disconnected from Kafka');
  }
}
