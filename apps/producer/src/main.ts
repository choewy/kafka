import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ProducerModule } from './producer.module';
import { ProducerConfigService } from './producer.config.service';

function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const swaggerTitle = configService.getOrThrow('npm_package_name');
  const swaggerVersion = configService.getOrThrow('npm_package_version');

  const options = new DocumentBuilder().setTitle(swaggerTitle).setVersion(swaggerVersion).build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  app.enableShutdownHooks();
  app.connectMicroservice(new ProducerConfigService(configService).kafkaOptions);

  await app.startAllMicroservices();
  await app.listen(3010);
}

void bootstrap();
