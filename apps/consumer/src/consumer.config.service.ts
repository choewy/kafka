import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConsumerConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get kafkaOptions(): KafkaOptions {
    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: String(this.configService.getOrThrow('KAFKA_BROKERS')).split(','),
        },
        consumer: {
          groupId: [this.configService.getOrThrow('KAFKA_CLIENT_ID'), 'consumer'].join('-'),
          allowAutoTopicCreation: true,
        },
      },
    };
  }
}
