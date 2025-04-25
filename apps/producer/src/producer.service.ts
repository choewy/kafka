import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async sendTestMessage(message: string) {
    return lastValueFrom<{
      id: string;
      topic: string;
      message: string;
    }>(this.kafkaClient.send('test', message));
  }
}
