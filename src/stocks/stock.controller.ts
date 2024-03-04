import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { Request } from 'express';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/lastbar')
  async getLastBar(@Req() req: Request): Promise<any> {
    const symbol = req.query.symbol;
    const resolution = req.query.resolution;

    if (!symbol || !resolution) {
      throw new BadRequestException('Missing parameter!');
    }
    return await this.stockService.getLastBar(symbol, resolution);
  }
}
