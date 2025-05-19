import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const CLIENT_ID = process.env.CLIENT_ID;
const BROKERS = process.env.BROKERS || 'host.docker.internal:9092';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [BROKERS],
          clientId: CLIENT_ID,
        },
        consumer: {
          groupId: 'notifier-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
