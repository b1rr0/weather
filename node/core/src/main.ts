import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Weather Forecast API')
    .setDescription(
      'Weather API application that allows users to subscribe to weather updates for their city.',
    )
    .setVersion('1.0.0')
    .addTag('weather', 'Weather forecast operations')
    .addTag('subscription', 'Subscription management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
