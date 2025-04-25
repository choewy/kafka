import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';

import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProducerConfigService } from './producer.config.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_PRODUCER',
        useFactory: () => new ProducerConfigService().kafkaOptions,
      },
    ]),
  ],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerConfigService],
})
export class ProducerModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    ['test'].forEach((topic) => {
      this.kafkaClient.subscribeToResponseOf(topic);
    });

    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }
}
