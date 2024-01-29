import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/history/:id')
  async getHistory(@Req() req: Request): Promise<any> {
    console.log(req);
    return await this.stockService.getHistory();
  }
}
