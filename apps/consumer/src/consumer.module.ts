import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { ConsumerConfigService } from './consumer.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: (configService: ConfigService) => new ConsumerConfigService(configService).kafkaOptions,
      },
    ]),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService, ConsumerConfigService],
})
export class ConsumerModule implements OnModuleInit, OnModuleDestroy {
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
