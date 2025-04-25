import { Injectable } from '@nestjs/common';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ProducerConfigService {
  public get kafkaOptions(): KafkaOptions {
    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'application',
          brokers: ['127.0.0.1:9093'],
        },
      },
    };
  }
}
