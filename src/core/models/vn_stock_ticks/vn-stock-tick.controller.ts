import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { VnStockTickService } from './vn-stock-tick.service';

@Controller('VnStock')
export class VnStockTickController {
  constructor(private readonly vnStockTickService: VnStockTickService) {}

  @Post('/webhook')
  async postWebhookData(@Req() req: Request): Promise<any> {
    const webhookData = req.body;

    if (!webhookData) {
      throw new BadRequestException('Missing parameter!');
    }

    this.vnStockTickService.handleWebhookData(webhookData);

    return {
      success: true,
      data: {},
    };
  }
}
