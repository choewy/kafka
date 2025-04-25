import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { ConsumerModule } from './consumer.module';
import { ConsumerConfigService } from './consumer.config.service';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.connectMicroservice(new ConsumerConfigService(configService).kafkaOptions);

  await app.startAllMicroservices();
  await app.listen(4000);
}

void bootstrap();
