import { Injectable } from '@nestjs/common';
import e from 'express';
import { Producer, Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'notifier',
      brokers: ['localhost:9092'],
    });

    this.producer = kafka.producer();
    this.connect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      console.log('Connected to Kafka');
    } catch (error) {
      console.error('Failed to connect to Kafka', error);
    }
  }

  async write(topic: string, key: string, message: any) {
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
      return true;
    } catch (error) {
      throw new Error('Failed to write to Kafka', error);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
