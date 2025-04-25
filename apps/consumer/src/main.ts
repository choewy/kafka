import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.module';
import { ConsumerConfigService } from './consumer.config.service';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);

  app.enableShutdownHooks();
  app.connectMicroservice(app.get(ConsumerConfigService).kafkaOptions);

  await app.startAllMicroservices();
  await app.listen(4000);
}

void bootstrap();
