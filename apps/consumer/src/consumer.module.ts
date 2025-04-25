import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { ConsumerConfigService } from './consumer.config.service';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_PRODUCER',
        useFactory: () => new ConsumerConfigService().kafkaOptions,
      },
    ]),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService, ConsumerConfigService],
})
export class ConsumerModule implements OnModuleInit, OnModuleDestroy {
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
