import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ProducerModule } from './producer.module';
import { ProducerConfigService } from './producer.config.service';

function setupSwagger(app: INestApplication) {
  const swaggerTitle = process.env.npm_package_name ?? '';
  const swaggerVersion = process.env.npm_package_version ?? '';

  const options = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setVersion(swaggerVersion)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);

  setupSwagger(app);

  app.enableShutdownHooks();
  app.connectMicroservice(app.get(ProducerConfigService).kafkaOptions);

  await app.startAllMicroservices();
  await app.listen(3010);
}

void bootstrap();
