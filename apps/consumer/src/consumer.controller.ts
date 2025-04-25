import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { v4 } from 'uuid';

import { ConsumerService } from './consumer.service';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get()
  getHello(): string {
    return this.consumerService.getHello();
  }

  @MessagePattern('test')
  handleTestMessage(@Payload() message: string, @Ctx() ctx: KafkaContext) {
    return {
      id: v4(),
      topic: ctx.getTopic(),
      message,
    };
  }
}
