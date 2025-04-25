import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ProducerConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get kafkaOptions(): KafkaOptions {
    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.configService.getOrThrow('KAFKA_CLIENT_ID'),
          brokers: String(this.configService.getOrThrow('KAFKA_BROKERS')).split(','),
        },
      },
    };
  }
}
