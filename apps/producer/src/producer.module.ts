import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProducerConfigService } from './producer.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: (configService: ConfigService) => new ProducerConfigService(configService).kafkaOptions,
      },
    ]),
  ],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerConfigService],
})
export class ProducerModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
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
