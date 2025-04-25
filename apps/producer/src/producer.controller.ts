import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProducerService } from './producer.service';

@ApiTags()
@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('test')
  productTestMessage() {
    return this.producerService.sendTestMessage('Hello from Producer');
  }
}
