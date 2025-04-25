import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

import { ProducerService } from './producer.service';

@ApiTags()
@Controller()
export class ProducerController {
  constructor(
    private readonly producerService: ProducerService,
    @Inject('KAFKA_PRODUCER')
    private readonly kafkaClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.producerService.getHello();
  }

  @Post('test')
  productTestMessage() {
    return lastValueFrom(this.kafkaClient.send('test', 'Hello World!'));
  }
}
