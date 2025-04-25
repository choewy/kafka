import { Injectable } from '@nestjs/common';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConsumerConfigService {
  public get kafkaOptions(): KafkaOptions {
    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['127.0.0.1:9093'],
        },
        consumer: {
          groupId: 'application-consumer',
          allowAutoTopicCreation: true,
        },
      },
    };
  }
}
