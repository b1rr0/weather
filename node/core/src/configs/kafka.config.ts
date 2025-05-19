import { KafkaConfig } from 'kafkajs';

const CLIENT_ID = process.env.CLIENT_ID || 'notifier';
const BROKERS = process.env.BROKERS || 'host.docker.internal:9092';

const kafkaConfig: KafkaConfig = {
  clientId: CLIENT_ID,
  brokers: [BROKERS],
};

export default kafkaConfig;
